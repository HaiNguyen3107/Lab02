import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`https://wld3q8-8081.csb.app/api/user/${userId}`, {
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch user");
        })
        .then((userData) => {
          setUser(userData);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [userId]);

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>

      <Typography variant="body1">Location: {user.location}</Typography>
      <Typography variant="body1">Description: {user.description}</Typography>
      <Typography variant="body1">Occupation: {user.occupation}</Typography>

      <Button
        variant="contained"
        component={Link}
        to={`/photos/${userId}`}
        sx={{ mt: 2 }}
      >
        View Photos
      </Button>
    </div>
  );
}

export default UserDetail;
