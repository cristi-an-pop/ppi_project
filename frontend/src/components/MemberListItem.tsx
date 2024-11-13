import { ListItem, Grid, Typography, IconButton } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { Member } from "../types/member";
import RequireRole from "./RequireRole";

interface MemberListItemProps {
  member: Member;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({
  member,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <ListItem>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="row" spacing={2}>
            <Grid item xs>
              <Typography variant="subtitle1" component="div">
                {member.firstName} {member.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Birth Date: {member.birthDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {member.city}, {member.country}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                edge="end"
                aria-label="view"
                onClick={() => onView(member.id!)}
              >
                <Visibility />
              </IconButton>
              <RequireRole role="admin">
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(member.id!)}
                >
                  <Edit />
                </IconButton>
              </RequireRole>
              <RequireRole role="admin">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(member.id!)}
                >
                  <Delete />
                </IconButton>
              </RequireRole>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <hr />
    </>
  );
};

export default MemberListItem;
