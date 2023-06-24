import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in
  const checkLoggedIn = async () => {
    let response = await fetch("/login/currentUser");
    let data = await response.json();
    if (data.isLoggedIn) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  };

  checkLoggedIn();
  return loggedIn ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoutes;
