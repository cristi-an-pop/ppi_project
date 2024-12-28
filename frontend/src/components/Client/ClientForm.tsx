import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import ClientService from "../../services/client.service";
import { Client } from "../../types/client";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const ClientForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<Client>({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    country: "",
    city: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof Client]?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setErrorMessage("");
  }, [formData]);

  const validate = (): boolean => {
    let tempErrors: { [key in keyof Client]?: string } = {};

    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.birthDate) tempErrors.birthDate = "Birth Date is required";
    if (!formData.country) tempErrors.country = "Country is required";
    if (!formData.city) tempErrors.city = "City is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        await ClientService.createClient(axiosPrivate, formData);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          birthDate: "",
          country: "",
          city: "",
        });
        navigate("/Clients");
      } catch (error: any) {
        setErrorMessage("Failed to add Client");
      }
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
          Add Client
        </Typography>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Birth Date"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          error={!!errors.birthDate}
          helperText={errors.birthDate}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          error={!!errors.country}
          helperText={errors.country}
          fullWidth
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Client
        </Button>
      </Box>
    </Container>
  );
};

export default ClientForm;
