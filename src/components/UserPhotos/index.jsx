import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";

function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function UserPhotos({ currentUser, uploadTrigger }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [photoOwner, setPhotoOwner] = useState(null);
  const [newComments, setNewComments] = useState({});
  // Info user
  useEffect(() => {
    if (userId) {
      fetch(`https://wld3q8-8081.csb.app/user/${userId}`, {
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch photo owner details");
        })
        .then((userData) => {
          setPhotoOwner(userData);
        })
        .catch((err) => {
          console.error("Error fetching photo owner:", err);
        });
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://wld3q8-8081.csb.app/photosOfUser/${userId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const result = await response.json();
        setPhotos(result);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, [userId, uploadTrigger]);

  const handleCommentChange = (photoId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [photoId]: value,
    }));
  };

  const handleAddComment = async (photoId) => {
    const commentText = newComments[photoId];
    if (!commentText || commentText.trim() === "") {
      console.log("Please enter a comment");
      setError("Please enter a comment for photo " + photoId);
      return;
    }
    setError(null);

    try {
      const response = await fetch(
        `https://wld3q8-8081.csb.app/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentText.trim() }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const newCommentData = await response.json();

        const actualCommentObjectFromServer = newCommentData.comment;

        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) => {
            if (photo._id === photoId) {
              const commentToAdd = {
                comment: actualCommentObjectFromServer.comment,
                date_time: actualCommentObjectFromServer.date_time,
                user: {
                  _id: actualCommentObjectFromServer.user_id,
                  first_name: currentUser?.first_name,
                  last_name: currentUser?.last_name,
                },
              };
              return {
                ...photo,
                comments: [...(photo.comments || []), commentToAdd],
              };
            }
            return photo;
          })
        );
        setNewComments((prev) => ({
          ...prev,
          [photoId]: "",
        }));
      } else {
        const errorData = await response.json();
        setError(
          `Failed to add comment: ${errorData.error || "Unknown error"}`
        );
        console.error("Failed to add comment:", errorData);
      }
    } catch (err) {
      setError(`Error adding comment: ${err.message}`);
      console.error("Error adding comment:", err);
    }
  };

  if (error && !photos.length) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!photos || photos.length === 0) {
    return <Typography variant="h6">No photos found for this user.</Typography>;
  }

  return (
    <div style={{ padding: 20 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Photos of{" "}
        {photoOwner
          ? `${photoOwner.first_name} ${photoOwner.last_name}`
          : "No User"}
      </Typography>
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card" sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            image={`https://wld3q8-8081.csb.app/images/${photo.file_name}`}
            alt={`Photo by user ${userId}`}
            className="photo-img"
            sx={{
              maxHeight: 400,
              objectFit: "contain",
              backgroundColor: "#f0f0f0",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <CardContent>
            <Typography
              className="photo-date"
              variant="caption"
              color="text.secondary"
            >
              Created on: {formatDateTime(photo.date_time)}
            </Typography>

            <Typography variant="h6" component="div" sx={{ mt: 1, mb: 1 }}>
              Comments:
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment, index) => (
                <Box
                  key={index}
                  sx={{ mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(comment.date_time)}
                  </Typography>
                  <Typography variant="body2">
                    <Link
                      to={`/users/${comment.user?._id}`}
                      style={{
                        color: "#4dabf7",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      {comment.user?.first_name || "Unknown"}{" "}
                      {comment.user?.last_name || "User"}
                    </Link>
                    : {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComments[photo._id] || ""}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                sx={{ mb: 1 }}
                variant="outlined"
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => handleAddComment(photo._id)}
              >
                Add Comment
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default UserPhotos;
