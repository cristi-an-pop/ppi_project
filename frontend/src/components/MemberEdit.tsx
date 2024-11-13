import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import memberService from "../services/member.service";
import { Member } from "../types/member";
import { TextField, Button, Container, Typography } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MemberEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Member>({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    city: "",
  });
  const [errors, setErrors] = useState<{ [key in keyof Member]?: string }>({});
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await memberService.getMemberById(axiosPrivate, id!);
        console.log(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Failed to fetch member", error);
      }
    };

    fetchMember();
  }, [id, axiosPrivate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        await memberService.editMember(axiosPrivate, id!, formData);
        navigate(-1);
      } catch (error) {
        alert("Failed to update member");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Update Member
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
          margin="normal"
          required
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
          margin="normal"
          required
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
          margin="normal"
          required
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={!!errors.city}
          helperText={errors.city}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Member
        </Button>
      </form>
    </Container>
  );
};

export default MemberEdit;
