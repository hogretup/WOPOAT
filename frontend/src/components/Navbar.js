import React, { useState, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import SumIcon from "@mui/icons-material/Functions";
import { useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import UserContext from "../context/UserContext";
import AvatarEXP from "../components/AvatarEXP";
import { EXPpercentage } from "../utils/EXP.js";

function NavBar() {
  // Auth Context
  let { user, logoutUser } = useContext(AuthContext);

  // User Context
  let { displayName, profilePicture, level, EXP } = useContext(UserContext);

  // Can consider making basic Menu button a component
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleHomeButton = () => {
    navigate("/home");
  };
  const handleAboutButton = () => {
    navigate("/about");
  };
  const handleProfileButton = () => {
    handleCloseUserMenu();
    navigate(`/profile/${user.username}`);
  };
  const handleLogoutButton = () => {
    handleCloseUserMenu();
    callLogout();
  };

  const handleFriendsButton = () => {
    handleCloseUserMenu();
    navigate("/friends");
  };

  const callLogout = async () => {
    logoutUser();
    navigate("/");
  };

  const pages = [{ name: "About", handler: handleAboutButton }];
  const settings = [
    { name: "Profile", handler: handleProfileButton },
    { name: "Friends", handler: handleFriendsButton },
    { name: "Logout", handler: handleLogoutButton },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={handleHomeButton}
        >
          <SumIcon />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QUIZZICALC
          </Typography>
        </IconButton>
        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: 1 }}
          justifyContent="flex-end"
        >
          {pages.map((page) => (
            <Button key={page.name} color="inherit" onClick={page.handler}>
              {page.name}
            </Button>
          ))}
          <IconButton
            id="profile-button"
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
          >
            <Typography variant="h6" sx={{ marginRight: "4px" }}>
              {displayName}
            </Typography>
            <AvatarEXP
              avatarSrc={profilePicture ? profilePicture : undefined}
              expPercentage={EXPpercentage(level, EXP)}
              level={level}
              size="small"
            />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseUserMenu}
          >
            {settings.map((item) => (
              <MenuItem key={item.name} onClick={item.handler}>
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
