import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import casesService from "../../services/cases.service";
import { Case } from "../../types/Case";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFileStorage } from "@/hooks/useFileStorage";


const MemberForm = () => {
  const clientId = useParams<{ clientId: string }>().clientId;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { storeFile } = useFileStorage();


  const [formData, setFormData] = useState<Case>({
    title: "",
    clientId: clientId!,
    image: null,
    teeth: [],
  });

  const [errors, setErrors] = useState<{ [key in keyof Case]?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };


  useEffect(() => {
    setErrorMessage("");
  }, [formData]);

  const validate = (): boolean => {
    const tempErrors: { [key in keyof Case]?: string } = {};

    if (!formData.title) tempErrors.title = "Title is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        let imageUrl = imageFile;
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append("image", imageFile);

          const uploadResponse = await axios.post('http://localhost:5000/api/upload', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          imageUrl = uploadResponse.data.filepath;
        }
        const newCase = {
          title: formData.title,
          clientId: clientId!,
          image: imageUrl,
          teeth: formData.teeth,
        };

        const dbCase = await casesService.createCase(axiosPrivate, newCase);

        await storeFile(`${dbCase.data.id!}`, imageFile!); 

        setFormData({
          title: "",
          clientId: clientId!,
          image: null,
          teeth: [],
        });
        setImageFile(null);
        setImagePreview(null);
        setErrorMessage("");
        navigate(`/clients/${clientId}/cases`);
      } catch (error: any) {
        setErrorMessage("Failed to add case");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box  component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
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
        <Box sx={{ position: 'relative' }}>
          <TextField
            type="file"
            onChange={handleFileChange}
            inputProps={{ 
              accept: "image/*",
              style: { cursor: 'pointer' }
            }}
            fullWidth
          />
          {imagePreview && (
            <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  borderRadius: '4px'
                }} 
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                  },
                }}
                size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Add Case
        </Button>
      </Box>
    </Container>
  );
};

export default MemberForm;
