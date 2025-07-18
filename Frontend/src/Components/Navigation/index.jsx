import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Logo from "../../Assets/logo.png";
import Av from "../../Assets/anon.png";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../Layout";
import { Link } from "react-router-dom";
import { styled as styled2 } from "@mui/system";
import { ApiClient } from "../../API/httpService";
import { useNotification } from "../Notification";
import { useUser } from "../User";

const pages = [
  "Single",
  "Double",
  "Coop",
  "Scores",
  "Leaderboard",
  "Add Score",
];
const settings = ["Profile", "Logout"];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [songName, setSongName] = React.useState("");
  const [diff, setDiff] = React.useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const { notify } = useNotification();
  const apiClient = React.useMemo(() => new ApiClient(), []);
  const { user, setUser } = useUser();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page) {
      if (page === "Add Score") {
        navigate("/add");
      } else {
        navigate(`/${page}`);
      }
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (action) => {
    switch (action) {
      case "Profile":
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            navigate(`/profile/${payload.sub}`);
          }
        } catch (e) {
          console.error("Failed to parse token", e);
        }
        break;
      case "Logout":
        localStorage.removeItem("token");
        window.location.reload();
        break;
      default:
        break;
    }

    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages
                  .filter(
                    (p) => p !== "Add Score" || (user && user.username === "Snaki")
                  )
                  .map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => handleCloseNavMenu(page)}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                <MenuItem
                  key="report"
                  onClick={() => {
                    setReportOpen(true);
                    setAnchorElNav(null);
                  }}
                >
                  <Typography textAlign="center">
                    Report Missing Chart
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <StyledLink to="/">
              <StyledLogo src={Logo} alt="Logo" />
            </StyledLink>
            <Box sx={{ flexGrow: 20, display: { xs: "none", md: "flex" } }}>
              {pages
                .filter(
                  (p) => p !== "Add Score" || (user && user.username === "Snaki")
                )
                .map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleCloseNavMenu(page)}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              <Button
                onClick={() => setReportOpen(true)}
                sx={{ my: 2, color: "inherit", display: "block", ml: 2 }}
              >
                Report Missing Chart
              </Button>
            </Box>
            {localStorage.getItem("token") ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="avatar" src={user?.avatarUrl || Av} />
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
                      onClick={() => handleCloseUserMenu(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <MenuItem
                onClick={() => {
                  navigate(`/login`);
                }}
              >
                <Typography textAlign="center">Log In</Typography>
              </MenuItem>
            )}
            <Tooltip title="Toggle dark mode">
              <IconButton
                sx={{ ml: 1 }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)}>
        <DialogTitle>Report Missing Chart</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Song name"
            fullWidth
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Diff"
            fullWidth
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              apiClient
                .reportMissing({ song_name: songName, diff })
                .then(() => notify("Report submitted", "success"))
                .catch(() => notify("Error submitting report", "error"));
              setReportOpen(false);
              setSongName("");
              setDiff("");
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default NavBar;

const StyledLink = styled2(Link)(() => ({
  flexGrow: "1",
}));

const StyledLogo = styled.img`
  height: 50px;
`;
