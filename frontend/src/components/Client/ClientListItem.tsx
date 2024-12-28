import { ListItem, Grid, Typography, IconButton } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { Client } from "../../types/client";
import RequireRole from "../RequireRole";

interface ClientListItemProps {
  Client: Client;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({
  Client,
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
                {Client.firstName} {Client.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Birth Date: {Client.birthDate}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Location: {Client.city}, {Client.country}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                edge="end"
                aria-label="view"
                onClick={() => onView(Client.id!)}
              >
                <Visibility />
              </IconButton>
              <RequireRole role="admin">
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(Client.id!)}
                >
                  <Edit />
                </IconButton>
              </RequireRole>
              <RequireRole role="admin">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(Client.id!)}
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

export default ClientListItem;
