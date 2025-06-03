import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Input } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

import "./styles.css";

function TopBar({ currentUser, onLogout }) {
  const location = useLocation();
  const { userId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  let rightContent = "Photo Sharing App";

  if (location.pathname.startsWith("/users/") && userId) {
    rightContent = "User Details";
  }

  if (location.pathname.startsWith("/photos/") && userId) {
    rightContent = "User Photos";
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("uploadedphoto", selectedFile);

    try {
      const response = await fetch("https://lkgky6-8081.csb.app/photos/new", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Photo uploaded successfully!");
        setSelectedFile(null);
        // Reset file input
        document.getElementById("photo-upload-input").value = "";
        // Reload page để hiển thị ảnh mới
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      alert("Upload error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          {currentUser ? `Hi ${currentUser.first_name}` : "Photo Sharing App"}
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {currentUser && (
            <>
              <Input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <label htmlFor="photo-upload-input">
                <Button variant="contained" component="span" size="small">
                  Choose Photo
                </Button>
              </label>

              {selectedFile && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </Button>
              )}

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={onLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        <Typography variant="h6" color="inherit">
          {rightContent}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
