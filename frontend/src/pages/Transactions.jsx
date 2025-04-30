import React, { useState } from "react";
import AllTransactionTable from "../components/alltransactiontable";

const Transactions = () => {
  const [search, setSearch] = useState("");

  const handleResetSearch = () => {
    setSearch("");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row  justify-between md:px-10 p-5 mt-3">
        <div>
          <h2 className="text-3xl font-semibold">Transaction Activity</h2>
        </div>
        <div className="gap-2 flex items-center ">
          {/* SearchBox  */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="text-gray-500 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6a7282"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
            {search && (
              <button
                onClick={handleResetSearch}
                className="absolute inset-y-0 end-0 flex items-center pr-3 text-gray-500 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" y1="18" x2="18" y2="6"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Serchbox   */}
        </div>
      </div>

      {/* Transaction Table  */}
      <AllTransactionTable search={search} />
    </div>
  );
};

export default Transactions;
