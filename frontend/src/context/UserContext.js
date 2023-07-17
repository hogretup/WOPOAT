import { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const UserContext = createContext();

export default UserContext;

// Context for components to access and refresh user profile info
export const UserProvider = ({ children }) => {
  let { logoutUser, authTokens } = useContext(AuthContext);

  const [profilePicture, setProfilePicture] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [friendsList, setFriendsList] = useState([]);

  // Fetch initial profile info, and refresh whenever user changes
  useEffect(() => {
    refreshProfileData();
  }, [authTokens]);

  // Fetch to refresh user profile state variables
  const refreshProfileData = async () => {
    const fetchUserProfile = async () => {
      const response = await fetch(`api/getUserProfile`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + String(authTokens?.access),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setProfilePicture(data.profile_image);
        setDisplayName(data.displayName);
        setEmail(data.email);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    };

    const fetchFriendsList = async () => {
      const response = await fetch("/api/getFriendsList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens?.access),
        },
      });

      const data = await response.json();
      // Not sure when response would fail
      if (response.status === 200) {
        setFriendsList(data);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
    };

    fetchUserProfile();
    fetchFriendsList();
  };

  // contextData are the props that all components can access
  let contextData = {
    profilePicture: profilePicture,
    displayName: displayName,
    email: email,
    friendsList: friendsList,
    refreshProfileData: refreshProfileData,
  };

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  );
};
