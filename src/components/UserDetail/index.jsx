import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";

function UserDetail() {
  const canEdit = currentUser && userId && currentUser._id === userId;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://wld3q8-8081.csb.app/user/${userId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to get data");
        }
        const result = await response.json();
        setUser(result);
      } catch (error) {
        setError(error.message);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div style={{ padding: 20 }}>
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
