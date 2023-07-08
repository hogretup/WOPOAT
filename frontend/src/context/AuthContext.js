import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

// Context for components to access authentication & user information
// Auth tokens stored in localstorage so they can persist in state vars
export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  // Makes sure everything in AuthContext is done before letting other components render
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Logs in the user by obtaining access and refresh tokens from Django,
  // (if authentication was successful) then storing them in localStorage.
  // Also returns whether authentication was successful
  let loginUser = async (username, password) => {
    let response = await fetch("/login/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  };

  // Logs out the user by setting user & tokens to null, and removing
  // auth tokens from localStorage
  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  };

  // Updates access and refresh tokens using current refresh token
  // If authTokens are not there, logs out user
  let updateToken = async () => {
    console.log("updateToken called");
    let response = await fetch("/login/token/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens?.refresh,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  // contextData are the props that all components can access
  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  // Refreshes the auth tokens every X seconds
  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // "loading" state ensures that
  // a. If access tokens are expired, updateToken has finished
  // b. If both tokens have expired, logs out user
  // both occur first before rendering the other components
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
