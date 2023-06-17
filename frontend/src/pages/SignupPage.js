import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    // Add your sign-up logic here
    const data = {
      username: username,
      password: password
    };
    console.log(data);
    console.log('here is the data');
    try {
      const response = await fetch('/login/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button onClick={handleSignup}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
