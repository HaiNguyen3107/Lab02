import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import models from "../../modelData/models";
import { Link } from "react-router-dom";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPhotos = await models.photoOfUserModel(userId);
        if (!fetchedPhotos) {
          setError("Failed to fetch user data.");
          return;
        }
        setPhotos(fetchedPhotos);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="h6">No photos available for this user.</Typography>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo._id}>
            <Card>
              <CardContent>
                <img
                  src={require(`../../images/${photo.file_name}`)}
                  alt={`${photo.user_id}`}
                  style={{
                    width: "80%",
                    height: "auto",
                    margin: "0 auto",
                    display: "block",
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  <strong>Created on:</strong>{" "}
                  {new Date(photo.date_time).toLocaleString()}
                </Typography>
                {photo.comments && photo.comments.length > 0 ? (
                  <div>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Comments:</strong>
                    </Typography>
                    {photo.comments.map((comment) => (
                      <div key={comment._id}>
                        <Typography variant="body2">
                          <Link to={`/users/${comment.user._id}`}>
                            <strong>
                              {comment.user.first_name} {comment.user.last_name}
                              :
                            </strong>
                          </Link>{" "}
                          {comment.comment}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.date_time).toLocaleString()}
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No comment
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserPhotos;
