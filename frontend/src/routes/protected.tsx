import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

const Protected = () => {
  const {isLoggedIn} = useAuth();
  return  isLoggedIn ? <Outlet/>: <Navigate to="/signin" />;
};

export default Protected;