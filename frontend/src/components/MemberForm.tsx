import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import memberService from "../services/member.service";
import { Member } from "../types/member";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const MemberForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<Member>({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    city: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof Member]?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setErrorMessage("");
  }, [formData]);

  const validate = (): boolean => {
    let tempErrors: { [key in keyof Member]?: string } = {};

    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
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
        await memberService.createMember(axiosPrivate, formData);
        setFormData({
          firstName: "",
          lastName: "",
          birthDate: "",
          country: "",
          city: "",
        });
        navigate("/members");
      } catch (error: any) {
        setErrorMessage("Failed to add member");
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
          Add Member
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
          Add Member
        </Button>
      </Box>
    </Container>
  );
};

export default MemberForm;
