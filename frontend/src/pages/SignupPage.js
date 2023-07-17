import React, { useState } from "react";
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
import { purple } from "@mui/material/colors";

// Custom color theme
const theme = createTheme({
  palette: {
    primary: purple,
  },
});

const SignUpPage = () => {
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

  const handleSignup = async (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    const response = await fetch("/login/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      navigate("/");
    } else {
      setErrorMessage("That username is taken. Try another.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ mt: 1, width: "100%" }}
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
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>

          {errorMessage && (
            <Typography color="error" align="center">
              {errorMessage}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link href="/login" color="primary">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpPage;
