import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdError } from "react-icons/md";
import api from "../libs/apiCall";

const AllTransactionTable = ({ search }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const getTransactions = async () => {
    try {
      const tableData = await api.get("/transaction/", {
        params: { s: search },
      });
      setTableData(tableData.data.data);
      console.log(tableData.data.data);
    } catch (error) {
      console.log("Transaction Fetch error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getTransactions();
  }, [search]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <FaSpinner className="animate-spin text-sky-600 " size={28} />
      </div>
    );

  return (
    <div className="p-5 pb-10 overflow-x-auto w-full  ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-700  whitespace-nowrap">
        <thead className="text-sm text-gray-900 uppercase">
          <tr className="border-b-4 border-gray-700">
            <th scope="col" className="px-11 py-3">
              Date
            </th>
            <th scope="col" className="px-11 pe-22 py-3">
              Description
            </th>
            <th scope="col" className="px-11 py-3">
              Status
            </th>
            <th scope="col" className="px-11 py-3">
              Source
            </th>
            <th scope="col" className="px-11 py-3">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((data, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-11 py-4">{data.createdat.split("T")[0]}</td>
                <th className="px-11 pe-26 py-4">{data.description}</th>
                <td className="px-7 py-4 flex gap-2 items-center">
                  {data.status === "completed" || "Completed" ? (
                    <>
                      <IoCheckmarkDoneCircleSharp
                        size={20}
                        className="text-green-600/80"
                      />
                      {data.status}
                    </>
                  ) : (
                    <>
                      <MdError size={20} className="text-orange-400" />
                      {data.status}
                    </>
                  )}
                </td>

                <td className="px-11 py-4">{data.source}</td>
                <th className="px-11 py-4">
                  {data.type === "Income" 
                    ? `+ ₹${data.amount}`
                    : `- ₹${data.amount}`}
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllTransactionTable;
