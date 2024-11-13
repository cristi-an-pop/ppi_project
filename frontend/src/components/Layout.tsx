import { Outlet, Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

const Layout = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth() as any;

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Datavid Cake Tracker
          </Typography>
          {auth?.username ? (
            <>
              <Box sx={{ display: "flex" }}>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/members">
                  Members
                </Button>
              </Box>
              <Button color="inherit" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
};

export default Layout;
