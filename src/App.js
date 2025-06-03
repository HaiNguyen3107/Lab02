import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    // Kiểm tra session từ localStorage hoặc gọi API để verify session
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
    fetch("https://lkgky6-8081.csb.app/admin/logout", {
      method: "POST",
      credentials: "include",
    });
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar currentUser={currentUser} onLogout={handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />

          {!currentUser ? (
            // Nếu chưa đăng nhập, hiển thị màn hình login
            <Grid item xs={12}>
              <Paper className="main-grid-item">
                <LoginRegister onLogin={handleLogin} />
              </Paper>
            </Grid>
          ) : (
            // Nếu đã đăng nhập, hiển thị app bình thường
            <>
              <Grid item sm={3}>
                <Paper className="main-grid-item">
                  <UserList />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route
                      path="/photos/:userId"
                      element={<UserPhotos currentUser={currentUser} />}
                    />
                    <Route path="/users" element={<UserDetail />} />
                    <Route path="/" element={<UserDetail />} />
                  </Routes>
                </Paper>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </Router>
  );
};

export default App;
