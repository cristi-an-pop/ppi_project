import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "../api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

const Register = () => {
  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrorMessage("");
  }, [username, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!USER_REGEX.test(username) || !PASSWORD_REGEX.test(password)) {
      setErrorMessage("Invalid Entry");
      return;
    }
    try {
      const role = isAdmin ? "admin" : "user";
      const response = await axios.post(
        REGISTER_URL,
        { username, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
      return;
    }
    setSuccess(true);
  };

  return (
    <Container maxWidth="sm">
      {success ? (
        <Typography variant="h4" component="h1" gutterBottom>
          Success!
          <Typography variant="body1">
            <a href="/login">Sign In</a>
          </Typography>
        </Typography>
      ) : (
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
            Register
          </Typography>
          <TextField
            label="Username"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
            fullWidth
            error={username ? !validName : false}
            helperText={
              username && !validName
                ? "4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed."
                : ""
            }
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            fullWidth
            error={password ? !validPassword : false}
            helperText={
              password && !validPassword
                ? "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character. Allowed special characters: !@#$%"
                : ""
            }
          />
          <TextField
            label="Confirm Password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            fullWidth
            error={confirmPassword ? !validMatch : false}
            helperText={
              confirmPassword && !validMatch
                ? "Must match the first password input field."
                : ""
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                color="primary"
              />
            }
            label="Admin Role"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!validName || !validPassword || !validMatch}
          >
            Sign Up
          </Button>
          <Typography variant="body1">
            Already registered? <a href="/login">Sign In</a>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Register;
