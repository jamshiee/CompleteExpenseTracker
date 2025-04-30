import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdError } from "react-icons/md";


export const LatestTransaction = ({ transactionData }) => {
  const transactions = Array.isArray(transactionData) ? transactionData : [];

  return (
    <div className="w-full">
      <div className="flex justify-between py-5 flex-wrap gap-2">
        <h4 className="text-2xl font-medium">Latest Transaction</h4>
        <a
          href="/transactions"
          className="text-sm text-gray-500 font-medium hover:underline"
        >
          View all
        </a>
      </div>

      {/* Responsive table container */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm text-left text-gray-700">
          <thead className="text-sm text-gray-900 uppercase bg-gray-100">
            <tr className="border-b-4 border-gray-700">
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((data, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.createdat?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      {data.status?.toLowerCase() === "completed" ? (
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {data.type === "Income"
                      ? `+ ₹${data.amount}`
                      : `- ₹${data.amount}`}
                  </td>
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
    </div>
  );
};


export const ListAccounts = () => {
  return (
    <div className="flex flex-col">
      <h4 className="text-2xl font-medium py-2">Accounts</h4>
      <a href="/transaction" className="text-gray-500">
        View all your accounts
      </a>
    </div>
  );
};
