import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth } = useContext(AuthContext) as any;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      const accessToken = response.data.accessToken;
      const role = response.data.role;
      setAuth({ username, accessToken, role });
      navigate(from, { replace: true });
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again later.");
      } else {
        console.log(error);
        setErrorMessage("Error in sending request.");
      }
      return;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {errorMessage && (
          <Alert severity="error" aria-live="assertive">
            {errorMessage}
          </Alert>
        )}
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          autoComplete="off"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!username || !password}
        >
          Sign In
        </Button>
        <Typography variant="body1">
          Need an account? <a href="/register">Register</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
