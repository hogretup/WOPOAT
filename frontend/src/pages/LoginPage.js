import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepOrange } from "@mui/material/colors";
import AuthContext from "../context/AuthContext";

// Custom color theme
const theme = createTheme({
  palette: {
    primary: deepOrange,
  },
});

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);

  // If user is already logged in, redirect to homepage
  if (user) {
    navigate("/home");
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    let authSucceeded = await loginUser(username, password);
    if (authSucceeded) {
      navigate("/home");
    } else {
      setErrorMessage("Username or password is incorrect");
    }
  };

  const goToSignupPage = () => {
    navigate("/signup");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            QUIZICALC
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 3, width: "100%" }}
          >
            <TextField
              fullWidth
              id="username"
              label="Username"
              value={username}
              onChange={handleUsernameChange}
              color="primary"
              required
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              color="primary"
              required
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          {errorMessage && (
            <Typography color="error" align="center">
              {errorMessage}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 3 }}>
            Don't have an account?{" "}
            <Link onClick={goToSignupPage} color="primary">
              Click here to sign up
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
