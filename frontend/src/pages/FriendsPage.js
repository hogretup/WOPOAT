import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Container,
  Paper,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AuthContext from "../context/AuthContext";

function FriendsPage() {
  const [friendUsername, setFriendUsername] = useState("");

  // User context
  let { authTokens, logoutUser } = useContext(AuthContext);

  const handleAddFriend = (event) => {
    console.log("Add friend");
  };

  // Gets user profile for friends list
  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch("/api/getUserProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      const data = await response.json();

      // Not sure when response would fail
      if (response.status === 200) {
        console.log(data);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ marginTop: "2rem", padding: 10 }}>
        <Typography variant="h4" style={{ marginBottom: "10px" }}>
          Friends
        </Typography>
        <Typography variant="body1">Add a friend</Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Enter username"
            value={friendUsername}
            onChange={(event) => {
              setFriendUsername(event.target.value);
            }}
            variant="outlined"
          />
          <IconButton edge="start" color="inherit" onClick={handleAddFriend}>
            <PersonAddIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Container>
  );
}
export default FriendsPage;
