import "./index.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Signin from "./pages/auth/signin";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Account from "./pages/Account";
import useStore from "./store/index";
import Navbar from "./components/ui/navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};


function App() {
  return (
    <div className="w-full min-h-screen bg-gray-100 max-w-screen overflow-x-hidden ">
      {/* px-6  md:px-20 */}
      <Routes>
        
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />

        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/account" element={<Account />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
