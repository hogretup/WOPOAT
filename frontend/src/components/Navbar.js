import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SumIcon from "@mui/icons-material/Functions";

const pages = ["About"];
const settings = ["Profile", "Logout"];

function NavBar() {
  // Can consider making basic Menu button a component
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
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
            <Button key={page} color="inherit">
              {page}
            </Button>
          ))}
          <IconButton
            id="profile-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
          >
            <ProfileIcon fontSize="large" />
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseUserMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {settings.map((item) => (
              <MenuItem key={item} onClick={handleCloseUserMenu}>
                {item}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
