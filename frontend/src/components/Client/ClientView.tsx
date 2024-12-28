import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientService from "../../services/client.service";
import { Client } from "../../types/client";
import { Container, Typography, Box, Paper, Button, Grid } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await ClientService.getClientById(axiosPrivate, id!);
        setClient(response.data);
      } catch (error) {
        console.error("Failed to fetch Client", error);
      }
    };

    fetchClient();
  }, [id, axiosPrivate]);

  if (!client) {
    return <Typography>Loading...</Typography>;
  }

  const handleViewCases = () => {
    navigate(`/clients/${id}/cases`);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Client Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">First Name: {client.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Last Name: {client.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Email: {client.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Birth Date: {client.birthDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Country: {client.country}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">City: {client.city}</Typography>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={handleViewCases}>
            View Cases
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClientView;``