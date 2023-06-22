import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("/login/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const responseData = await response.json();
      if (responseData == "success") {
        navigate("/home");
      } else {
        setErrorMessage("Username or password is incorrect");
      }
    } catch (error) {
      // Handle error
      setErrorMessage("An error occurred");
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
