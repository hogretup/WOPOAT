import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";

function ProfilePage() {
  // Auth context
  let { authTokens, logoutUser } = useContext(AuthContext);

  // User context (with actual profile info from backend)
  let { profilePicture, displayName, email, refreshProfileData } =
    useContext(UserContext);

  // Profile info fields filled in
  const [displayNameField, setDisplayNameField] = useState(displayName);
  const [emailField, setEmailField] = useState(email);
  const [displayNameChanged, setDisplayNameChanged] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [quizHistory, setquizHistory] = useState([]);

  // Updates user details in backend, and refreshes data
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
    setSelectedTab("profile");
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      {selectedTab === "profile" ? (
        <form>
          <Stack spacing={2} alignItems="center">
            <Avatar
              alt="?"
              src={profilePicture ? profilePicture : undefined} // Display the profile picture if it exists
              sx={{ width: 100, height: 100 }}
            >
              {/* Display the icon only if there is no profile picture */}
            </Avatar>
            {isEditMode ? (
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
            ) : null}
            <TextField
              label="Display Name"
              value={displayNameField}
              onChange={handleDisplayNameChange}
              variant="outlined"
              disabled={!isEditMode}
            />
            <TextField
              label="Email"
              type="email"
              value={emailField}
              onChange={handleEmailChange}
              variant="outlined"
              disabled={!isEditMode}
            />
            {isEditMode ? (
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
            )}
          </Stack>
        </form>
      ) : (
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      )}
      <BottomNavigation
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
      </BottomNavigation>
    </div>
  );
}

export default ProfilePage;