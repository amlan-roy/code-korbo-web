"use client";

import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import assert from "assert";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";

type NavbarProps = {
  centerComponent?: React.ReactNode;
  hamburgerElements?: React.ReactNode;
  handleLogout?: Function;
  isLoggedIn?: boolean;
  rightComponent?: React.ReactNode;
  userName?: string | null;
};

const drawerWidth = 240;

/**
 * A react component responsible for displaying the UI of the navbar.
 * It takes in callback functions, components and states as input.
 *
 * @param centerComponent : Optional component to be rendered in the center of the navbar
 * @param hamburgerElements : Optional Components to be rendered inside the hamburger
 * @param handleLogout : Function to handle the logout
 * @param isLoggedIn : boolean to identify if the user is logged in or not
 * @param rightComponent : optional component to be rendered in the right side of the nav bar
 * @param userName : optional name of the user
 */
const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  handleLogout,
  hamburgerElements,
  centerComponent,
  rightComponent,
  userName,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileLogout = () => {
    if (isLoggedIn) {
      assert(
        handleLogout,
        "handleLogout method should be passed when isLoggedIn is true"
      );
    }
    handleLogout?.().then(() => {
      handleClose();
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="flex h-[70px] w-full shrink-0 items-center p-5 bg-slate-50">
      <div className="m-auto h-[50px] w-full items-center justify-between px-6 flex max-w-[1440px]">
        {isLoggedIn && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
            className="block sm:!hidden" //using classname instead of sx to use the same breakpoints
          >
            <MenuIcon />
          </IconButton>
        )}
        <div>
          <Link
            href="/"
            style={{ textDecoration: "none" }}
            className="flex items-center justify-center h-20"
          >
            <Typography fontSize={20} fontWeight={600}>
              Code Korbo
            </Typography>
          </Link>
        </div>
        {centerComponent && (
          <div className="flex-grow hidden sm:block">{centerComponent}</div>
        )}
        <div className="hidden items-center gap-4 sm:flex">
          {rightComponent}
          {isLoggedIn && (
            <>
              <IconButton
                aria-label="profile"
                size="small"
                id="profile-button"
                aria-controls={open ? "profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleButtonClick}
              >
                <Avatar>{userName?.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
            </>
          )}
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "profile-button",
            }}
            sx={{
              padding: 5,
            }}
          >
            <MenuItem onClick={handleProfileLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <div>
              <Toolbar>
                <div className="flex row w-full justify-between m-2 my-4">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                    className="block sm:hidden" //using classname instead of sx to use the same breakpoints
                  >
                    <MenuIcon />
                  </IconButton>

                  <div className="flex justify-between items-center">
                    <Avatar />
                  </div>
                </div>
              </Toolbar>
              <Divider />
              <div className="w-full">
                <Button
                  onClick={handleProfileLogout}
                  fullWidth
                  startIcon={<Logout fontSize="small" />}
                  sx={{
                    justifyContent: "space-between",
                    px: 4,
                  }}
                >
                  Logout
                </Button>
              </div>
              <Divider />
              {hamburgerElements}
            </div>
          </Drawer>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
