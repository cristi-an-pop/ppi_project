import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import memberService from "../services/member.service";
import { Member } from "../types/member";
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
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import MemberListItem from "./MemberListItem";

const MemberList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [sorted, setSorted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchMembers = async () => {
    const response = await memberService.getAllMembers(axiosPrivate, sorted);
    // const response = sorted
    //   ? await memberService.getSortedMembers(axiosPrivate)
    //   : await memberService.getAllMembers(axiosPrivate);
    setMembers(response.data);
  };

  useEffect(() => {
    fetchMembers();
  }, [sorted]);

  const handleSortToggle = () => {
    setSorted(!sorted);
  };

  const handleAddMember = () => {
    navigate("/members/new");
  };

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
        setMembers(members.filter((member) => member.id !== selectedMemberId));
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Members
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSortToggle}>
          {sorted ? "Show Members Unsorted" : "Sort by Closest Birthdays"}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAddMember}>
          Add Member
        </Button>
      </Box>
      <List>
        {members.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
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

export default MemberList;
