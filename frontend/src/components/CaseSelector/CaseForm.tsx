import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import casesService from "../../services/cases.service";
import { Case } from "../../types/Case";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const MemberForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<Case>({
    title: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof Case]?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setErrorMessage("");
  }, [formData]);

  const validate = (): boolean => {
    let tempErrors: { [key in keyof Case]?: string } = {};

    if (!formData.title) tempErrors.title = "Title is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        await casesService.createCase(axiosPrivate, formData);
        setFormData({
          title: "",
        });
        navigate("/cases");
      } catch (error: any) {
        setErrorMessage("Failed to add case");
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
          Add Case
        </Typography>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Case
        </Button>
      </Box>
    </Container>
  );
};

export default MemberForm;
