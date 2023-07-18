import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Container,
  Paper,
  IconButton,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";

function FriendsPage() {
  const [friendUsername, setFriendUsername] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);

  const [usernameError, setUsernameError] = useState(false);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  // User context
  let { friendsList, refreshProfileData } = useContext(UserContext);

  // Auth context
  let { authTokens, logoutUser } = useContext(AuthContext);

  const handleAddFriend = async (event) => {
    // Already friends
    if (friendsList.includes(friendUsername)) {
      setAlreadyFriends(true);
      return;
    }
    const response = await fetch(`api/sendFriendRequest/${friendUsername}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    if (response.status === 200) {
      setUsernameError(false);
      setAlreadyFriends(false);
      setFriendRequestSent(true);

      // Reset the friend request sent message after a certain duration
      setTimeout(() => {
        setFriendRequestSent(false);
      }, 3000);
    } else {
      setAlreadyFriends(false);
      setUsernameError(true);
    }
  };

  const handleAccept = async (requestID) => {
    const response = await fetch(`api/acceptFriendRequest/${requestID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    // Refresh friends list and friend requests list
    refreshProfileData();
    fetchFriendRequests();
  };

  const handleDecline = async (requestID) => {
    const response = await fetch(`api/declineFriendRequest/${requestID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    // Refresh friend requests list
    fetchFriendRequests();
  };

  // Gets list of username & request IDs of pending friend requests
  const fetchFriendRequests = async () => {
    const response = await fetch("/api/getFriendRequests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    const data = await response.json();
    // Not sure when response would fail
    if (response.status === 200) {
      setFriendRequests(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  // Gets list of pending friend requests
  useEffect(() => {
    // fetchFriendsList();
    fetchFriendRequests();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ marginTop: "2rem", padding: 10 }}>
        <Typography variant="h4" style={{ marginBottom: "10px" }}>
          Friends
        </Typography>
        <Typography variant="body1">Add a friend</Typography>
        <Stack spacing={3}>
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
            <Box display="flex" alignItems="center">
              {usernameError
                ? "Username does not exist"
                : friendRequestSent
                ? "Friend request sent!"
                : alreadyFriends
                ? "You are already friends."
                : ""}
            </Box>
          </Stack>
          <TableContainer component={Paper} sx={{ mb: "2rem" }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Friend Requests</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {friendRequests.length === 0 ? (
                  <TableCell component="th" scope="row">
                    You have no pending friend requests.
                  </TableCell>
                ) : (
                  <></>
                )}
                {friendRequests.map((request, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box display="flex" justifyContent="space-between">
                        <div>{request.username}</div>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAccept(request.requestID)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDecline(request.requestID)}
                          >
                            Decline
                          </Button>
                        </Stack>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ mb: "2rem" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Friend List</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {friendsList.length === 0 ? (
                  <TableCell component="th" scope="row">
                    Your friends list is empty. Invite some friends!
                  </TableCell>
                ) : (
                  <></>
                )}
                {friendsList.map((friend, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt="?"
                          src={
                            friend.profile_image
                              ? friend.profile_image
                              : undefined
                          }
                          sx={{ marginRight: "12px" }}
                        />
                        <Link to={`/profile/${friend.username}`}>
                          {friend.displayName}
                        </Link>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </Container>
  );
}
export default FriendsPage;
