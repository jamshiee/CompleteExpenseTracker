import React, { useEffect, useState } from "react";
import api from "../libs/apiCall";
import { FaSpinner } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import AddMoney from "./AddMoney";
import useStore from "../store";

const AccountCards = () => {
  // const [accData, setAccData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModaltype] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const {accData,setAccData} = useStore()

  const getAllAcounts = async () => {
    try {
      setIsLoading(true);
      const fetchAccounts = await api.get("/account/");
      setAccData(fetchAccounts.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setModal = (value) => {
    setModaltype(value);
    setIsOpen(true);
  };

  useEffect(() => {
    getAllAcounts();
  }, []);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString("en-IN");
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <FaSpinner className="animate-spin text-sky-600 " size={28} />
      </div>
    );


  return (
    <div className="px-2 md:px-5 max-w-7xl mx-auto">
      {accData.length > 0 ? (
        <div className="grid gap-6 mb-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 auto-rows-fr">
          {accData.map((data, i) => (
            <div key={i} className="flex justify-center">
              <div className="relative w-full max-w-[360px] h-56 bg-red-100 rounded-xl text-white shadow-2xl transition-transform transform hover:scale-105 overflow-hidden">
                <img
                  className="absolute object-cover w-full h-full rounded-xl"
                  src="https://i.imgur.com/kGkSg1v.png"
                  alt="Background"
                />

                <div className="absolute inset-0 px-6 py-4 flex flex-col justify-between h-full z-10">
                  {/* Top */}
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-xl sm:text-2xl">
                      {data.account_name}
                    </p>
                    <img
                      className="w-12 h-12"
                      src="https://i.imgur.com/bbPHJVe.png"
                      alt="Logo"
                    />
                  </div>

                  {/* Balance */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      ₹ {formatCurrency(Number(data.account_balance))}
                    </h2>
                  </div>

                  {/* Card Number */}
                  <div>
                    <h1 className="text-sm font-light">Card Number</h1>
                    <p className="text-sm font-medium tracking-wide">
                      {data.account_number.match(/.{1,4}/g).join("-")}
                    </p>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20">
                    <button
                      className="text-white hover:bg-white/20 rounded-full p-1"
                      onClick={() =>
                        setMenuOpenIndex(menuOpenIndex === i ? null : i)
                      }
                    >
                      <HiOutlineDotsVertical size={22} />
                    </button>
                  </div>

                  {menuOpenIndex === i && (
                    <div className="absolute bottom-20 right-4 bg-white text-gray-800 rounded shadow-md w-36 z-30">
                      <button
                        onClick={() => {
                          setSelectedAccount(data);
                          setModal("add");
                        }}
                        className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
                      >
                        Add Money
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(data);
                          setModal("transfer");
                        }}
                        className="w-full text-left text-sm px-4 py-2 hover:bg-gray-100 border-t"
                      >
                        Transfer Funds
                      </button>
                    </div>
                  )}

                  {isOpen && (
                    <AddMoney
                      modalType={modalType}
                      accData={selectedAccount}
                      fullData={accData}
                      open={isOpen}
                      onClose={() => {
                        setSelectedAccount(null);
                        setIsOpen(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full mt-10">
          <h2 className="text-center font-semibold text-gray-700 text-2xl">
            No Accounts Here
          </h2>
        </div>
      )}
    </div>
  );
};

export default AccountCards;
