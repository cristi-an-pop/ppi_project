import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import useAuth from "../hooks/useAuth";
import memberService from "../services/member.service";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Member } from "../types/member";
import MemberListItem from "./MemberListItem";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { auth } = useAuth() as any;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [birthdayMembers, setBirthdayMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBirthdayMembers = async () => {
      try {
        const response = await memberService.getMembersWithBirthdaysToday(
          axiosPrivate
        );
        setBirthdayMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members with birthdays today", error);
      }
    };

    if (auth?.username) {
      fetchBirthdayMembers();
    }
  }, [auth]);

  const handleView = (id: string) => {
    navigate(`/members/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/members/edit/${id}`);
  };

  const handleDelete = async () => {
    if (selectedMemberId !== null) {
      try {
        await memberService.deleteMember(axiosPrivate, selectedMemberId);
        setBirthdayMembers(
          birthdayMembers.filter((member) => member.id !== selectedMemberId)
        );
      } catch (error) {
        console.error("Failed to delete member", error);
      } finally {
        setOpen(false);
        setSelectedMemberId(null);
      }
    }
  };

  const handleOpenDialog = (id: string) => {
    setSelectedMemberId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedMemberId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {auth?.username && (
        <>
          <Typography variant="h4" gutterBottom>
            Welcome, {auth.username}!
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/members"
            >
              Members
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom>
            Birthdays Today
          </Typography>
          {birthdayMembers.length > 0 ? (
            <List>
              {birthdayMembers.map((member) => (
                <MemberListItem
                  key={member.id}
                  member={member}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleOpenDialog}
                />
              ))}
            </List>
          ) : (
            <Typography>No members have birthdays today.</Typography>
          )}
        </>
      )}
      {!auth?.username && (
        <Typography variant="h3" gutterBottom>
          Home
        </Typography>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this member?
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

export default Home;
