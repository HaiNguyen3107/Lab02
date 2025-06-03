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

// Hàm tiện ích để định dạng ngày giờ theo "HH:mm:ss DD/MM/YYYY" SỬ DỤNG GIỜ UTC
function formatDateTimeUTC(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Sử dụng các phương thức getUTC... để lấy thông tin theo giờ UTC
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getUTCFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function UserPhotos({ currentUser }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetch(`https://lkgky6-8081.csb.app/api/photo/user/${userId}`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch photos");
      })
      .then((photoData) => {
        setPhotos(photoData);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching photos:", err);
      });
  }, [userId]);

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
        `https://lkgky6-8081.csb.app/commentsOfPhoto/${photoId}`,
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
        window.location.reload();
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
    <div>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}
      {photos.map((photo) => (
        <Card key={photo._id} className="photo-card" sx={{ mb: 2 }}>
          <CardMedia
            component="img"
            image={`https://lkgky6-8081.csb.app/images/${photo.file_name}`}
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
              {/* SỬ DỤNG HÀM ĐỊNH DẠNG UTC MỚI */}
              Created on: {formatDateTimeUTC(photo.date_time)}
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
                    {/* SỬ DỤNG HÀM ĐỊNH DẠNG UTC MỚI */}
                    {formatDateTimeUTC(comment.date_time)}
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
