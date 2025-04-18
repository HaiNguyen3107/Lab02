import React from "react";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) {
    return <Typography variant="h6">User not found.</Typography>;
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Description:</strong> {user.description}
        </Typography>
        <Button variant="contained" component={Link} to={`/photos/${user._id}`}>
          View photos of {user.first_name} {user.last_name}
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
