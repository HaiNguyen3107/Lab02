import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://wld3q8-8081.csb.app/user/list", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        setError("An error occurred while fetching the data.");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        User List
      </Typography>

      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItemButton component={Link} to={`/users/${item._id}`}>
              <ListItemText
                primary={item.first_name + " " + item.last_name}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItemButton>
            <Divider sx={{ bgcolor: "#444" }} />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
