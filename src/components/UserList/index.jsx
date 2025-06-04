import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://wld3q8-8081.csb.app/user/list", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch users");
      })
      .then((userData) => {
        setUsers(userData);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        User List
      </Typography>

      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem button component={Link} to={`/users/${item._id}`}>
              <ListItemText
                primary={item.first_name + " " + item.last_name}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItem>
            <Divider sx={{ bgcolor: "#444" }} />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
