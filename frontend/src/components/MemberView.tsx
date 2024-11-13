import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import memberService from "../services/member.service";
import { Member } from "../types/member";
import { Container, Typography, Box } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MemberView = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await memberService.getMemberById(axiosPrivate, id!);
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch member", error);
      }
    };

    fetchMember();
  }, [id, axiosPrivate]);

  if (!member) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Member Details
      </Typography>
      <Box>
        <Typography variant="h6">First Name: {member.firstName}</Typography>
        <Typography variant="h6">Last Name: {member.lastName}</Typography>
        <Typography variant="h6">Birth Date: {member.birthDate}</Typography>
        <Typography variant="h6">Country: {member.country}</Typography>
        <Typography variant="h6">City: {member.city}</Typography>
      </Box>
    </Container>
  );
};

export default MemberView;
