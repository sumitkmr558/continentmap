import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Continents", path: "/map" },
  // { label: "About", path: "/about" },
  { label: "Countries", path: "/wmap" },
  { label: "Guess MY Name", path: "/gmng" },
  { label: "Indian Map", path: "/im" },
];

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Learn World Map
        </Typography>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: "none", flexGrow: 0 }}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              component={NavLink}
              to={item.path}
              sx={({ isActive }) =>
                isActive
                  ? { fontWeight: "bold", textDecoration: "underline" }
                  : {}
              }
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              component={NavLink}
              to={item.path}
              onClick={handleMenuClose}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
