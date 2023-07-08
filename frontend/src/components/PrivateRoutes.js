import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Private routes redirect unauthenticated users to the login page
function PrivateRoutes() {
  // If the user is not yet authenticated, "user" will be null.
  let { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
