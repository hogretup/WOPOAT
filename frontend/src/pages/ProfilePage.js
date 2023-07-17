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

function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [quizHistory, setquizHistory] = useState([]);

  let { authTokens } = useContext(AuthContext);
  // Simulating data retrieval from a database
  useEffect(() => {
    // Fetch user data from the database and update the state
    const fetchData = async () => {
      try {
        // Simulated API call or database query
        const response = await fetch(`api/getUserProfile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },})
          if (response.ok) {
            const data = await response.json()
            setProfilePicture(data.profile_image);
            console.log(data)
          }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', file);
  
      const response = await fetch(`api/updateUserDetails`, {
        method: 'POST',
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        console.log('Profile picture updated successfully');
        // Handle success case as needed
      } else {
        // Handle the case where the response is not successful
        console.error('Failed to update profile picture:', response.status);
      }
    } catch (error) {
      // Handle any error that occurs during the fetch request
      console.error('Error updating profile picture:', error);
    }
  };
  

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
    setSelectedTab("profile");
  };

  const handleSaveChanges = () => {
    // Perform database update or API call to save the changes
    // Here, you can send the updated data to the server
    updateProfilePicture(profilePicture)
    // After successful update, exit edit mode
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
              alt="Profile Picture"
              src={profilePicture ? profilePicture : undefined} // Display the profile picture if it exists
              sx={{ width: 100, height: 100 }}
            >
              {profilePicture ? null : <ImageIcon fontSize="large" />} {/* Display the icon only if there is no profile picture */}
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
              label="Displayed Name"
              value={displayName}
              onChange={handleDisplayNameChange}
              variant="outlined"
              disabled={!isEditMode}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
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
