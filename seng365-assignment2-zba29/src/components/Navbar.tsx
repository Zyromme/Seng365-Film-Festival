import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import { useTokenStore } from "../store/TokenStore";
import axios from "axios";
import { useUserIdStore } from "../store/UserIdStore";

const baseUrl = "http://localhost:4941/api/v1";

const Navbar = () => {
  const token = useTokenStore((state) => state.token);
  const userId = useUserIdStore((state) => state.userId);
  const setToken = useTokenStore((state) => state.setToken);
  const setUserId = useUserIdStore((state) => state.setUserId);
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [settings, setSettings] = React.useState(["Login", "Register"]);

  React.useEffect(() => {
    if (token !== "" && userId !== "") {
      setSettings(["Profile", "MyFilms", "Create Film", "Logout"]);
    } else {
      setSettings(["Login", "Register"]);
    }
  }, [token, userId]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleLogout() {
    var config = {
      method: "post",
      url: baseUrl + "/users/logout",
      headers: {
        "X-Authorization": token,
      },
    };

    axios(config)
      .then(function (response) {
        setToken("");
        setUserId("");
        navigate("/login");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handeClickedOnProfileOptions = (button: string) => {
    if (button === "Login") {
      navigate("/login");
    } else if (button === "Register") {
      navigate("/register");
    } else if (button === "Logout") {
      handleLogout();
    } else if (button === "Profile") {
      navigate("/user/" + userId);
    } else if (button === "Create Film") {
      navigate("/createFilm");
    } else if (button === "MyFilms") {
      navigate("/myFilms");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h4" noWrap style={{ marginLeft: 0 }}>
          Film Festival
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Go to films">
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/films"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Films
            </Typography>
          </Tooltip>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src="/broken-image.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handeClickedOnProfileOptions(setting)}
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
