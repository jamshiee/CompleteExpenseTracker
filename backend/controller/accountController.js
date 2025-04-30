import { db } from "../libs/database.js";

export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.user;

    const accounts = await db.query({
      text: "SELECT * FROM tblaccount WHERE user_id = $1",
      values: [userId],
    });

    res.status(200).json({
      message: "Fetched all accounts",
      data: accounts.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const { name, amount, acc_number } = req.body;

    const accountExists = await db.query({
      text: "SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2",
      values: [name, userId]
    });

    const accountExist = accountExists.rows[0];

    if (accountExist) {
      return res.status(409).json({
        message: "Account already Exists",
      });
    }

    const createAccount = await db.query({
      text: "INSERT INTO tblaccount(user_id,account_name,account_number,account_balance) VALUES ($1,$2,$3,$4) RETURNING *",
      values: [userId, name, acc_number, amount],
    });

    const account = createAccount.rows[0];

    const userAccounts = Array.isArray(name) ? name : [name];

    const updateUserAccountQuery = {
      text: "UPDATE tbluser SET accounts = array_cat(accounts,$1),updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      values: [userAccounts, userId],
    };

    const description = account.account_name + "(Initial Deposit)";

    const initialDepositQuery = await db.query({
      text: "INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      values: [
        userId,
        description,
        "Income",
        "Completed",
        amount,
        account.account_name,
      ],
    });

    res.status(200).json({
      message: account.account_name + " Account created successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { amount } = req.body;

    const newAmount = Number(amount);

    const result = await db.query({
      text: "UPDATE tblaccount SET account_balance = (account_balance + $1),updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      values: [newAmount, id],
    });

    const account = result.rows[0];

    const description = account.account_name + "(Deposit)";

    const depositQuery = await db.query({
      text: "INSERT INTO tbltransaction(user_id,description,type,status,amount,source) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      values: [
        userId,
        description,
        "Income",
        "Completed",
        amount,
        account.account_name,
      ],
    });

    res.status(200).json({
      message: "₹"+  amount + " credited to " +account.account_name  ,
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
