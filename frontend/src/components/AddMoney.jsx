import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import api from "../libs/apiCall";
import useStore from "../store";

const AddMoney = ({ modalType, open, onClose, accData, fullData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountId, setAccountId] = useState();
  const [accountName, setAccountName] = useState("");
  const [transferAmount, setTransferAmount] = useState();
  
  

  const accountSelect = (id, name) => {
    setAccountId(id);
    setAccountName(name);
    setMenuOpen(!menuOpen);
  };



  const addMoneySubmit=async()=>{
    try {
     
        const res = await api.put(`/account/add-money/${accData.id}`,{
            amount:transferAmount
        })
        onClose()
        alert(res.data.message);
        window.location.reload()

    } catch (error) {
        console.log(error);
        
    }
  }

  const transferMoneySubmit = async () => {
    try {
        const res = await api.put("/transaction/transfer-money", {
            from_account: accData.id,
            to_account: accountId,
            amount:transferAmount,
          });
          alert(res.data.message);
          window.location.reload()
          
    } catch (error) {
        console.log(error);
        
    }
  };

 


  return (
    <div>
      <Modal open={open} onClose={onClose}>
        {modalType === "add" ? (
         // <form >
          <div>
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-semibold mb-5">Add Money</h2>

              <div>
                <div className="flex flex-col my-2">
                  <label className="font-medium mb-1">Enter amount</label>
                  <input
                    type="number"
                    className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded"
                    onChange={(e)=>setTransferAmount(e.target.value)}
                  />
                </div>

                <button onClick={addMoneySubmit} className="my-5 w-60 bg-sky-500  text-white text-center font-medium py-2 px-4  shadow-md rounded items-center hover:cursor-pointer ">
                  Submit
                </button>
              </div>
            </div>
          </div>
         // </form> 
        ) : (
          <div>
            {/* <form > */}
            <div className="flex flex-col items-center ">
              <h2 className="text-3xl font-semibold mb-5">Transfer Money</h2>
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">From Account</label>

              <div className="relative">
                <div className="w-60 bg-gray-200 hover:bg-white/70  text-gray-400 text-center font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded inline-flex items-center transition delay-300 duration-700 ease-in-out hover:cursor-pointer ">
                  {accData.account_name}
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-3 ">
              <label className="font-medium mb-1">To Account</label>

              <div className="relative">
                <div
                  className="w-60 bg-gray-200 hover:bg-white/70  text-gray-900 text-center font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded inline-flex items-center transition delay-300 duration-700 ease-in-out hover:cursor-pointer "
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {accountName ? (
                    accountName
                  ) : (
                    <div className="text-gray-400">Select</div>
                  )}
                </div>
                <ul
                  className={`absolute ${
                    menuOpen ? "block" : "hidden"
                  } bg-white text-gray-800 pt-1 w-60 rounded-md mt-2 shadow-md text-center outline-2 outline-gray-300 hover:cursor-pointer `}
                >
                  {fullData.filter((item) => item.id !== accData.id).map((item, index) => (
                    <li
                      key={index}
                      className="hover:bg-gray-200  border-b-1 py-2 px-4"
                      onClick={() => accountSelect(item.id, item.account_name)}
                    >
                      {item.account_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col my-2">
              <label className="font-medium mb-1">Amount</label>
              <input
                type="number"
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
              />
            </div>

            <button
              className="my-5 w-60 bg-sky-500  text-white text-center font-medium py-2 px-4  shadow-md rounded items-center hover:cursor-pointer "
              onClick={transferMoneySubmit}
            >
              Submit
            </button>
            {/* </form> */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddMoney;
