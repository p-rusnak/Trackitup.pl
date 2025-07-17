import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Navigation";
import NotificationProvider from "../Notification";
import UserProvider from "../User";
import SessionBanner from "../SessionBanner";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, GlobalStyles } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const themeLight = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#e5e5e5ff",
      paper: "#cccbcbff",
    },
  },
});

const themeDark = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#595959ff",
      paper: "#1d1d1dff",
    },
    text: {
      primary: "#ffffff",
    },
  },
});
const Layout = () => {
  const [mode, setMode] = React.useState("light");
  const theme = useTheme();
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={mode === "light" ? themeLight : themeDark}>
        <UserProvider>
          <NotificationProvider>
            <CssBaseline />
            <GlobalStyles
              styles={{
                body: { backgroundColor: theme.background },
              }}
            />
            <div>
              <Navbar />
              <SessionBanner />
              <Box
                sx={{
                  padding: {
                    sx: "0px 0 0 0",
                    md: "50px 10%;",
                  },
                }}
              >
                <Outlet />
              </Box>
            </div>
          </NotificationProvider>
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Layout;
