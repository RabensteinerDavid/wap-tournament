import { Navigate } from "react-router-dom";
import { SingleElimination } from "../components/types-elimination";

const Protected = () => {
  const token = localStorage.getItem("token");
  return token ? <SingleElimination id="672e02dc9f2e0a54b3bb53c7"/> : <Navigate to="/signin" />;
};

export default Protected;