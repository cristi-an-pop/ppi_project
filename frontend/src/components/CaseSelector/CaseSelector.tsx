import { useEffect, useState } from 'react';
import { Case } from '../../types/Case';
import { useNavigate } from "react-router-dom";
import CaseItem from './CaseItem';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
  } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate"; 
import casesService from '../../services/cases.service';

const CaseSelector = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        const response = await casesService.getAllCases(axiosPrivate);
        setCases(response.data);
    };

    const handleAdd = () => {
        navigate('/cases/new');
    };

    const handleDelete = async () => {
        if (selectedCaseId !== null) {
          try {
            await casesService.deleteCase(axiosPrivate, selectedCaseId);
            setCases(cases.filter((caseItem) => caseItem.id !== selectedCaseId));
          } catch (error) {
            console.error("Failed to delete case", error);
          } finally {
            setOpen(false);
            setSelectedCaseId(null);
          }
        }
      };

    const handleOpenDialog = (id: string) => {
        setSelectedCaseId(id);
        setOpen(true);
      };
    
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedCaseId(null);
    };

    return (
        <Container>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">Cases</Typography>
              <Button color="inherit" onClick={handleAdd}>
                Add Case
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container spacing={4} style={{ marginTop: '16px' }}>
            {cases.map((caseItem) => (
              <Grid item xs={12} sm={6} md={4} key={caseItem.id}>
                <CaseItem caseItem={caseItem} onDelete={handleOpenDialog} />
              </Grid>
            ))}
          </Grid>
          <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this case?
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

export default CaseSelector;