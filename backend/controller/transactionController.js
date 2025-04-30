import { getMonthName } from "../libs/authValidation.js";
import { db } from "../libs/database.js";

export const getTransactions = async (req, res) => {
  try {
    const { s } = req.query;
    const { userId } = req.user;

  

    const transactions = await db.query({
      text: `
        SELECT * FROM tbltransaction 
        WHERE user_id = $1 
        AND (
          description ILIKE '%' || $2 || '%' 
          OR status ILIKE '%' || $2 || '%' 
          OR source ILIKE '%' || $2 || '%'
        ) 
        ORDER BY id DESC
      `,
      values: [userId, s || ""], // default to empty string to match all
    });

    res.status(200).json({
      data: transactions.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const getDashboard = async (req, res) => {
    try {
        const { userId } = req.user;
    
        let totalIncome = "";
        let totalExpense = "";
    
        const transactionsResult = await db.query({
          text: `SELECT type, SUM(amount) AS totalAmount FROM 
        tbltransaction WHERE user_id = $1 GROUP BY type`,
          values: [userId],
        });
    
        const transactions = transactionsResult.rows;
    
        transactions.forEach((transaction) => {
          if (transaction.type === "Income" ) {
            totalIncome += transaction.totalamount;
          } else {
            totalExpense += transaction.totalamount;
          }
        });
    
        const availableBalance = totalIncome - totalExpense;
    
        const year = new Date().getFullYear();
        const start_Date = new Date(year, 0, 1); 
        const end_Date = new Date(year, 11, 31, 23, 59, 59); 
    
        const result = await db.query({
          text: `
          SELECT 
            EXTRACT(MONTH FROM createdat) AS month,
            type,
            SUM(amount) AS totalAmount 
          FROM 
            tbltransaction 
          WHERE 
            user_id = $1 
            AND createdat BETWEEN $2 AND $3 
          GROUP BY 
            EXTRACT(MONTH FROM createdat), type`,
          values: [userId, start_Date, end_Date],
        });
        
        const data = new Array(12).fill().map((_, index) => {
          const monthData = result.rows.filter(
            (item) => parseInt(item.month) === index + 1
          );
    
          const income =
            monthData.find((item) => item.type === "Income")?.totalamount || 0;
    
          const expense =
            monthData.find((item) => item.type === "Expense")?.totalamount || 0;
    
          return {
            label: getMonthName(index),
            income,
            expense,
          };
        });
    
        const lastTransactionsResult = await db.query({
          text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
          values: [userId],
        });
    
        const lastTransactions = lastTransactionsResult.rows;
    
        const lastAccountResult = await db.query({
          text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
          values: [userId],
        });
    
        const lastAccount = lastAccountResult.rows;
    
        res.status(200).json({

          availableBalance,
          totalIncome:Number(totalIncome),
          totalExpense:Number(totalExpense),
          chartData: data,
          lastTransactions,
          lastAccount,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    };

export const addTransaction = async (req, res) => {
 
    try {
        const { userId } = req.user;
        const { account_id } = req.params;
        const { description, source, amount } = req.body;
      
        if (!description || !source || !amount) {
          return res.status(403).json({
            message: "Provide Required Fields",
          });
        }
      
        if (Number(amount) <= 0)
          return res.status(403).json({
            message: "Amount should be greater than 0. ",
          });
      
          const result = await db.query({
              text:"SELECT * FROM tblaccount WHERE id = $1",
              values:[account_id]
          })
      
          const accountInfo = result.rows[0];
      
          if(!accountInfo){
              return res.status(404).json({
                  message:"Invalid Account Information"
              })
          }
      
          if(accountInfo.account_balance <= 0 || accountInfo.account_balance < Number(amount)){
              return res.status(403).json({
                  message:"Transaction failed. Insufficient account balance"
              })
          }
      
      
          await db.query("BEGIN");
      
          await db.query({
              text:"UPDATE tblaccount SET account_balance = (account_balance - $1),updatedat = CURRENT_TIMESTAMP WHERE id =$2",
              values:[amount,account_id]
          })
      
          await db.query({
              text:" INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6)",
              values:[userId,description,"Expense","Completed",amount,source]
          })
      
          await db.query("COMMIT");
      
          res.status(200).json({
              message:"Transaction completed successfully"
          })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

};

export const transferMoneyBwAccount = async (req, res) => {
    try {
        const {userId} = req.user;

        const {from_account,to_account,amount} = req.body;

        if(!from_account||!to_account||!amount){
            return res.status(403).json({
                message:"Provide required fields"
            })
        }

        const newAmount = Number(amount);

        if(newAmount <= 0){
            return res.status(403).json({
                message:"Amount should be greater than 0."
            })
        }

        const fromAccountResult = await db.query({
            text:"SELECT * FROM tblaccount WHERE id = $1",
            values:[from_account]
        });

        const fromAccount =fromAccountResult.rows[0];

        if (!fromAccount) {
            return res.status(402).json({
                message:"Account information not found"
            })
        }

        if(newAmount > fromAccount.account_balance){
            return res.status(403).json({
                message:"Transfer Failed. Insufficient account balance"
            })
        }

        await db.query("BEGIN");

        await db.query({
            text:"UPDATE tblaccount SET account_balance = (account_balance - $1) , updatedat = CURRENT_TIMESTAMP WHERE id = $2 ",
            values:[newAmount,from_account]
        })

        const toAccount = await db.query({
            text:"UPDATE tblaccount SET account_balance = (account_balance + $1) , updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            values:[newAmount,to_account]
        })

        const description = `Transfer ${fromAccount.account_name} - ${toAccount.rows[0].account_name}`

        await db.query({
            text:" INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6)",
            values:[userId,description,"Expense","Completed",amount,fromAccount.account_name]
        })

        const description1 = `Recieved ${fromAccount.account_name} - ${toAccount.rows[0].account_name}`

        await db.query({
            text:" INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6)",
            values:[userId,description1,"Income","Completed",amount,toAccount.rows[0].account_name]
        })

        await db.query("COMMIT")

        res.status(200).json({
            message:"Transfer completed successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const generateDummyData =async()=>{
      try {
        
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
}
