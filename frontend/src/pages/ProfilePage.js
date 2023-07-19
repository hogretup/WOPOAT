import React, { useState, useEffect, useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import {
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Container,
} from "@mui/material";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";

function ProfilePage() {
  // user that the profile belongs to
  const [profileUser, setProfileUser] = useState(null);

  // If this profile is the current users' profile
  const [myProfile, setMyProfile] = useState(false);

  // username in url parameter
  const { u } = useParams();

  // Auth context
  let { user, authTokens, logoutUser } = useContext(AuthContext);

  // Quiz stats
  const [numExpand, setNumExpand] = useState(0);
  const [numFactorise, setNumFactorise] = useState(0);
  const [top3, setTop3] = useState([]); // List of top 3 quiz attempts (Ranked by Score > Difficulty > Timing)

  useEffect(() => {
    setProfileUser(null);
    setMyProfile(false);
    if (user.username === u) {
      setProfileUser(user);
      setMyProfile(true);
    } else {
      // Fetches user profile information
      fetchUserProfileByUsername(u);
    }
    // Fetches quiz stats
    fetchQuizStats(u);
  }, [u]);

  const fetchQuizStats = async (username) => {
    const response = await fetch(`api/getCompletedQuizStats/${username}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + String(authTokens?.access),
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log(data);
      setNumExpand(data.numExpand);
      setNumFactorise(data["numFactorise"]);
      setTop3(data["top3"]);
    }
  };
  const fetchUserProfileByUsername = async (username) => {
    const response = await fetch(`api/getUserProfileByUsername/${username}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + String(authTokens?.access),
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      setProfileUser(username);
      setfProfilePicture(data.profile_image);
      setfDisplayName(data.displayName);
      setfEmail(data.email);
    }
  };

  // NOT MY PROFILE state vars
  const [fProfilePicture, setfProfilePicture] = useState(null);
  const [fDisplayName, setfDisplayName] = useState("");
  const [fEmail, setfEmail] = useState("");

  // MY PROFILE info from backendUser context (with actual profile info from backend)
  let { profilePicture, displayName, email, refreshProfileData } =
    useContext(UserContext);

  // MY PROFILE info fields filled in
  const [displayNameField, setDisplayNameField] = useState(displayName);
  const [emailField, setEmailField] = useState(email);
  const [displayNameChanged, setDisplayNameChanged] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  // const [selectedTab, setSelectedTab] = useState("profile");
  const [quizHistory, setquizHistory] = useState([]);

  // Updates MY PROFILE details in backend, and refreshes data
  const updateUserDetails = async (
    updateProfilePic,
    updateDisplayName,
    updateEmail,
    profilePicFile
  ) => {
    // Update profile info in backend
    const formData = new FormData();

    if (updateProfilePic) {
      formData.append("profile_image", profilePicFile);
    }
    if (updateDisplayName) {
      formData.append("displayName", displayNameField);
    }
    if (updateEmail) {
      formData.append("email", emailField);
    }
    const response = await fetch(`api/updateUserDetails`, {
      method: "POST",
      headers: {
        //"Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${authTokens.access}`,
      },
      body: formData,
    });

    if (response.status === 200) {
      // Refresh user profile info
      refreshProfileData();
    } else {
      logoutUser();
    }
  };

  const handleDisplayNameChange = (e) => {
    setDisplayNameField(e.target.value);
    setDisplayNameChanged(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateUserDetails(true, false, false, file);
      setProfilePictureChanged(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmailField(e.target.value);
    setEmailChanged(true);
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    // setSelectedTab("profile");
  };

  const handleSaveChanges = async () => {
    // Update the inputs that changed
    updateUserDetails(
      profilePictureChanged,
      displayNameChanged,
      emailChanged,
      null
    );

    setProfilePictureChanged(false);
    setDisplayNameChanged(false);
    setEmailChanged(false);

    setIsEditMode(false);
  };

  /*
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };*/

  // if profile does not exist
  if (profileUser === null) {
    return (
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h6">User profile does not exist.</Typography>
        </Box>
      </div>
    );
  }

  return (
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
        <form>
          <Stack spacing={2} alignItems="center">
            <Avatar
              alt="?"
              src={
                myProfile
                  ? profilePicture
                    ? profilePicture
                    : undefined
                  : fProfilePicture
                  ? fProfilePicture
                  : undefined
              } // Display the profile picture if it exists
              sx={{ width: 100, height: 100 }}
            >
              {/* Display the icon only if there is no profile picture */}
            </Avatar>
            {isEditMode && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="profile-picture-upload"
                  style={{ display: "none" }}
                  onChange={handleProfilePictureChange}
                />
                <label htmlFor="profile-picture-upload">
                  <Button variant="contained" component="span" color="primary">
                    Upload Photo
                  </Button>
                </label>
              </>
            )}
            {myProfile ? (
              <TextField
                label="Display Name"
                value={displayNameField}
                onChange={handleDisplayNameChange}
                variant="outlined"
                disabled={!myProfile || !isEditMode}
              />
            ) : (
              <Typography variant="h6">{fDisplayName}</Typography>
            )}

            {myProfile && (
              <TextField
                label="Email"
                type="email"
                value={emailField}
                onChange={handleEmailChange}
                variant="outlined"
                disabled={!myProfile || !isEditMode}
              />
            )}
            {myProfile &&
              (isEditMode ? (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              ))}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 1,
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h2" color="dodgerblue">
                  {numExpand}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Expand
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h2" color="teal">
                  {numFactorise}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Factorise
                </Typography>
              </Box>
            </Box>
          </Stack>
        </form>
        {/* <BottomNavigation
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ width: "100%", position: "fixed", bottom: 0 }}
        >
          <BottomNavigationAction
            label="Edit Profile"
            value="profile"
            icon={<EditIcon />}
          />
          <BottomNavigationAction
            label="View History"
            value="history"
            icon={<HistoryIcon />}
          />
        </BottomNavigation>*/}
      </Box>
    </Container>
  );
}

export default ProfilePage;
