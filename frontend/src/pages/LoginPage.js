import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  let { user, loginUser } = useContext(AuthContext);

  // If user is already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Returns true or false, for successful/unsuccessful authentication
    let authSucceeded = await loginUser(username, password);
    if (authSucceeded) {
      navigate("/home");
    } else {
      setErrorMessage("Username or password is incorrect");
    }
  };

  const goToSignupPage = () => {
    // Add your sign up logic here
    console.log("Sign up button clicked");
    navigate("/signup");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      <p>
        Don't have an account?{" "}
        <button onClick={goToSignupPage}>Click here to sign up</button>.
      </p>
    </div>
  );
}

export default LoginPage;
