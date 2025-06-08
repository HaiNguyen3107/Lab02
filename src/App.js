import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photoUploadTrigger, setPhotoUploadTrigger] = useState(0);
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    // Gọi API logout
    fetch("https://wld3q8-8081.csb.app/admin/logout", {
      method: "POST",
      credentials: "include",
    });
  };
  const handlePhotoUploaded = () => {
    // Tăng giá trị của trigger để kích hoạt useEffect trong UserPhotos
    setPhotoUploadTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              currentUser={currentUser}
              onLogout={handleLogout}
              onPhotoUploaded={handlePhotoUploaded}
            />
          </Grid>
          <div className="main-topbar-buffer" />

          {!currentUser ? (
            <Grid item xs={12}>
              <LoginRegister onLogin={handleLogin} />
            </Grid>
          ) : (
            <>
              <Grid item sm={3}>
                <UserList />
              </Grid>
              <Grid item sm={9}>
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route
                    path="/photos/:userId"
                    element={
                      <UserPhotos
                        currentUser={currentUser}
                        uploadTrigger={photoUploadTrigger}
                      />
                    }
                  />
                  <Route path="/users" element={<UserDetail />} />
                  <Route path="/" element={<UserDetail />} />
                </Routes>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </Router>
  );
}

export default App;
