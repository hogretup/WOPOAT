import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const authenticated = false;
  return authenticated ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
