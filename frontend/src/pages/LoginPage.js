import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Perform login logic with username and password
    console.log('Logging in...');
    console.log('Username:', username);
    console.log('Password:', password);
    navigate('/home');
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

      <p>
        Don't have an account?{' '}
        <a href="/signup">Click here to sign up</a>.
      </p>
    </div>
  );
}

export default LoginPage;