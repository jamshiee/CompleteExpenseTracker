import React, { useEffect, useState } from "react";
import AccountCards from "../components/accountcards";
import Modal from "../components/Modal";
import useStore from "../store/index";
import api from "../libs/apiCall";
import { Button } from "@headlessui/react";

const allAccountTypes = ["Cash", "Crypto", "Paypal", "Visa Debit Card"];

const Account = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openType, setOpenType] = useState("");
  const [accountType, setAccountType] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [initialAmount, setInitialAmount] = useState();
  const [existingAccounts, setExistingAccounts] = useState([]);
  const [payAccountid, setPayAccountId] = useState();
  const [payAccountName, setPayAccountName] = useState("");
  const [payDescription, setPayDescription] = useState("");
  const [payAmount, setPayAmount] = useState();

  const { isOpen, setIsOpen } = useStore((state) => state);

  const { accData } = useStore();

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/account/");
      setExistingAccounts(res.data.data.map((acc) => acc.account_name));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [isOpen]);

  const remainingAccountTypes = allAccountTypes.filter(
    (type) => !existingAccounts.includes(type)
  );

  const payAccountDetails = (name,id) =>{
    setPayAccountName(name);
    setPayAccountId(id);

  }

  const onSubmit = async () => {
    if (existingAccounts.length >= 4) {
      alert("You can only create up to 4 accounts.");
      return;
    }
    try {
      const addAcc = await api.post("/account/create", {
        name: accountType,
        acc_number: accountNum,
        amount: initialAmount,
      });
      setIsOpen(false);
      alert(addAcc.data.message)
      window.location.reload;
    } catch (error) {
      console.log(error);
    }
  };


  const onPaySubmit = async () =>{

    if (!payDescription || ! payAmount || payAmount == 0 ) {
      alert("Cant proceed without valid details")
    }
    try {
      const res = await api.post(`transaction/add-transaction/${payAccountid}`,{
        description:payDescription,
        source: payAccountName,
        amount: payAmount,
      })
      alert(res.data.message)
      setIsOpen(false);

      window.location.reload()

    } catch (error) {
      console.log(error);
      alert(error)
    }
    

  }

  const accountSelect = (value) => {
    setAccountType(value);
    setOpen(false);
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row  justify-between md:px-10 p-5 mt-3">
        <div>
          <h4 className="text-3xl font-semibold">My Accounts</h4>
        </div>
        <div>
          <div className="">
            <Button
              onClick={() => {
                setOpenType("pay");
                setIsOpen(true);
              }}
              className=" bg-white py-1 px-3 mr-6 text-lg rounded-sm outline-3 outline-sky-500 font-semibold text-sky-500 shadow-md transition delay-50 duration-500 hover:cursor-pointer hover:shadow-2xl hover:scale-120"
            >
              Pay
            </Button>
            <Button
              onClick={() => {
                setOpenType("add");
                setIsOpen(true);
              }}
              className=" bg-white py-1 px-3 text-lg rounded-sm outline-3 outline-sky-500 font-semibold text-sky-500 shadow-md transition delay-50 duration-500 hover:cursor-pointer hover:shadow-2xl hover:scale-120"
            >
              Add
            </Button>
          </div>
          <Modal
            open={isOpen}
            onClose={() => {
              setOpenType("");
              setPayAccountName("");
              setIsOpen(false);
            }}
          >
            {openType === "add" ? (
              <div>
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-semibold mb-5">Add Acount</h2>
                  <div className="flex flex-col">
                    <label className="font-medium mb-1">Select Account</label>
                    <div className="relative">
                      <div
                        className="w-60 bg-gray-200 hover:bg-white/70  text-gray-400 text-center font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded inline-flex items-center transition delay-300 duration-700 ease-in-out hover:cursor-pointer "
                        onClick={() => setOpen(!open)}
                      >
                        {accountType ? accountType : "Select Account"}
                      </div>
                      <ul
                        className={`absolute ${
                          open ? "block" : "hidden"
                        } bg-white text-gray-800 pt-1 w-60 rounded-md mt-2 shadow-md text-center outline-2 outline-gray-300 hover:cursor-pointer`}
                      >
                        {remainingAccountTypes.length > 0 ? (
                          remainingAccountTypes.map((item, index) => (
                            <li
                              key={index}
                              className="hover:bg-gray-200 border-b-1 py-2 px-4"
                              onClick={() => accountSelect(item)}
                            >
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 py-2 px-4">
                            No more account types
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {accountType && (
                    <div>
                      <div className="flex flex-col my-2">
                        <label className="font-medium mb-1">
                          Account Number
                        </label>
                        <input
                          type="number"
                          onChange={(e) => setAccountNum(e.target.value)}
                          className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
                        />
                      </div>

                      <div className="flex flex-col my-2">
                        <label className="font-medium mb-1">
                          Initial Amount
                        </label>
                        <input
                          type="number"
                          onChange={(e) => setInitialAmount(e.target.value)}
                          className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
                        />
                      </div>

                      <button
                        className="my-5 w-60 bg-sky-500  text-white text-center font-medium py-2 px-4  shadow-md rounded items-center hover:cursor-pointer "
                        onClick={onSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-semibold mb-5">Pay </h2>

                  <div className="flex flex-col mt-3  ">
                    <label className="font-medium mb-1">Select Account</label>

                    <div className="relative">
                      <div
                        className="w-60 bg-gray-200 hover:bg-white/70  text-gray-900 text-center font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded inline-flex items-center transition delay-300 duration-700 ease-in-out hover:cursor-pointer "
                        onClick={() => setMenuOpen(!menuOpen)}
                      >
                        {payAccountName ? (
                          payAccountName
                        ) : (
                          <div className="text-gray-400">Select</div>
                        )}
                      </div>
                      <ul
                        className={`absolute ${
                          menuOpen ? "block" : "hidden"
                        } bg-white text-gray-800 pt-1 w-60 rounded-md mt-2 shadow-md text-center outline-2 outline-gray-300 hover:cursor-pointer `}
                      >
                        {accData
                          .map((item, index) => (
                            <li
                              key={index}
                              className="hover:bg-gray-200  border-b-1 py-2 px-4"
                              onClick={() =>{
                                payAccountDetails(item.account_name,item.id)
                                setMenuOpen(!menuOpen)
                              }
                              }
                            >
                              {item.account_name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col my-2">
                    <label className="font-medium mb-1">Description</label>
                    <input
                      type="text"
                      onChange={(e) => setPayDescription(e.target.value)}
                      className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
                    />
                  </div>

                  <div className="flex flex-col my-2">
                    <label className="font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-60 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
                    />
                  </div>
                </div>

                {payAccountName && (
                  <button
                    className="my-5 w-60 bg-sky-500  text-white text-center font-medium py-2 px-4  shadow-md rounded items-center hover:cursor-pointer "
                    onClick={onPaySubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            )}
          </Modal>
        </div>
      </div>

      <AccountCards />
    </div>
  );
};

export default Account;
