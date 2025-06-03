import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

function LoginRegister({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register

  // Login state
  const [loginData, setLoginData] = useState({
    login_name: "",
    password: "",
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    login_name: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://lkgky6-8081.csb.app/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Kiểm tra password khớp
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://lkgky6-8081.csb.app/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: registerData.login_name,
          password: registerData.password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          location: registerData.location,
          description: registerData.description,
          occupation: registerData.occupation,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setSuccess("Registration successful! You can now login.");
        setRegisterData({
          login_name: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          location: "",
          description: "",
          occupation: "",
        });
        setIsLogin(true); // Chuyển về form login
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" textAlign="center" gutterBottom>
            {isLogin ? "Login" : "Register"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {isLogin ? (
            // Form Login
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Login Name"
                value={loginData.login_name}
                onChange={(e) =>
                  setLoginData({ ...loginData, login_name: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            // Form Register
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Login Name"
                value={registerData.login_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    login_name: e.target.value,
                  })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="First Name"
                value={registerData.first_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    first_name: e.target.value,
                  })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={registerData.last_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    last_name: e.target.value,
                  })
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Location"
                value={registerData.location}
                onChange={(e) =>
                  setRegisterData({ ...registerData, location: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={registerData.description}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    description: e.target.value,
                  })
                }
                margin="normal"
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Occupation"
                value={registerData.occupation}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    occupation: e.target.value,
                  })
                }
                margin="normal"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Me"}
              </Button>
            </form>
          )}

          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin
              ? "Need an account? Register here"
              : "Already have an account? Login here"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginRegister;
