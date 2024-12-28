import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientService from "../../services/client.service";
import { Client } from "../../types/client";
import {
  Box,
  Container,
  Typography,
  List,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ClientListItem from "./ClientListItem";

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [sorted, setSorted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchClients = async () => {
    const response = await clientService.getAllClients(axiosPrivate);
    // const response = sorted
    //   ? await ClientService.getSortedClients(axiosPrivate)
    //   : await ClientService.getAllClients(axiosPrivate);
    setClients(response.data);
  };

  useEffect(() => {
    fetchClients();
  }, [sorted]);

  const handleSortToggle = () => {
    setSorted(!sorted);
  };

  const handleAddClient = () => {
    navigate("/clients/new");
  };

  const handleView = (id: string) => {
    navigate(`/clients/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/clients/edit/${id}`);
  };

  const handleDelete = async () => {
    if (selectedClientId !== null) {
      try {
        await clientService.deleteClient(axiosPrivate, selectedClientId);
        setClients(clients.filter((client) => client.id !== selectedClientId));
      } catch (error) {
        console.error("Failed to delete Client", error);
      } finally {
        setOpen(false);
        setSelectedClientId(null);
      }
    }
  };

  const handleOpenDialog = (id: string) => {
    setSelectedClientId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedClientId(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Clients
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSortToggle}>
          {sorted ? "Show Clients Unsorted" : "Sort by Closest Birthdays"}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAddClient}>
          Add Client
        </Button>
      </Box>
      <List>
        {clients.map((client) => (
          <ClientListItem
            key={client.id}
            Client={client}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleOpenDialog}
          />
        ))}
      </List>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Client?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientList;
