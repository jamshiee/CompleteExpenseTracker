import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi2";
import { ChartLine, ChartPie } from "../components/pichart";
import { LatestTransaction, ListAccounts } from "../components/latesttransaction";
import api from "../libs/apiCall";

const Dashboard = () => {
  const [data, setData] = useState([]);
  // const [arrayData,setArrayData] 
  const [isLoading, setIsLoading] = useState();

  const fetchDasboard = async () => {
    try {
      const dashboardData = await api.get("/transaction/dashboard");
      setData(dashboardData.data)
      
    } catch (error) {
      console.log("Error message: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  

  useEffect(() => {
    setIsLoading(true);
    fetchDasboard();
   
  }, []);



  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A";
    return value.toLocaleString("en-IN");
  };

  // console.log(data)
  
  // then in JSX
  // <p>Available Balance: {formatCurrency(data.availableBalance)}</p>
  



  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <FaSpinner className="animate-spin text-violet-600 " size={28} />
      </div>
    );

  return (
    <div className="px-2 md:px-5 2xl:px-20 pb-15">
      <div className="flex flex-col md:flex-row md:items-center py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-semibold text-bold mb-2">Dashboard</h1>
          <span className="text-gray-600 ">
            Moniter your financial activities
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-around items-center gap-5 mb-10 md:flex-row">
        <div className="flex bg-sky-400 px-10  p-6 py-14 rounded-full shadow-md  ">
          <div className="flex items-center px-2">
            <HiCurrencyDollar size={45} className="text-white" />
          </div>
          <div className="flex-col ">
            <div className="text-white">Total Balance</div>
            <div className="font-bold text-4xl text-white">{formatCurrency(data.availableBalance)}</div>
          </div>
        </div>

        <div className="flex bg-sky-400 px-10 p-6 py-14 rounded-full shadow-md  ">
          <div className="flex items-center px-2">
            <HiCurrencyDollar size={45} className="text-white" />
          </div>
          <div className="flex-col ">
            <div className="text-white">Total Income</div>
            <div className="font-bold text-4xl  text-white">{formatCurrency(data.totalIncome)}</div>
          </div>
        </div>

        <div className="flex bg-sky-400 px-10 p-6 py-14 rounded-full shadow-md ">
          <div className="flex items-center px-2">
            <HiCurrencyDollar size={45} className="text-white" />
          </div>
          <div className="flex-col ">
            <div className="text-white">Total Expense</div>
            <div className="font-bold text-4xl text-white">{formatCurrency(data.totalExpense)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-bold mb-4">
          Transaction Activity
        </h1>
      </div>
      
      <div className="">
        <div className="flex flex-col gap-10 p-3 md:flex-row">
          <ChartLine chartData = {data}/>
        
          <ChartPie chartData = {data} />
        </div>
      </div>

      <div className="flex flex-col my-8   ">
       <div>
        <LatestTransaction transactionData = {data.lastTransactions}/>
        
       </div>
      
      </div>

    </div>
  );
};

export default Dashboard;
