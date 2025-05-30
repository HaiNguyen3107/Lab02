import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then((photoData) => {
        setPhotos(photoData);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [userId]);

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!photos || photos.length === 0) {
    return <Typography variant="h6">No photos found for this user.</Typography>;
  }

  return (
    <div>
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card">
          <CardMedia
            component="img"
            image={require(`../../images/${photo.file_name}`)}
            alt="User Photo"
            className="photo-img"
          />
          <CardContent>
            <Typography className="photo-date">
              Date: {new Date(photo.date_time).toLocaleString()}
            </Typography>

            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} style={{ marginTop: "10px" }}>
                  <Typography className="photo-comment-time">
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                  <Typography className="photo-comment">
                    <Link
                      to={`/users/${comment.user._id}`}
                      style={{ color: "#4dabf7", textDecoration: "none" }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    : {comment.comment}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography className="photo-no-comment">No comments.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
