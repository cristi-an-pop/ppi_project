import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { auth } = useAuth() as any;

  return (
    <Container sx={{ mt: 4 }}>
      {auth?.username && (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, {auth.username}!
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/cases"
            >
              Cases
            </Button>
          </Box>
        </>
      )}
      {!auth?.username && (
        <Typography variant="h3" gutterBottom>
          Home
        </Typography>
      )}
    </Container>
  );
};

export default Home;
