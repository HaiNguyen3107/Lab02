import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import models from "../../modelData/models";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const userId = location.pathname.split("/")[2];

      const fetchedUser = await models.userModel(userId);
      if (fetchedUser) {
        setUserName(`${fetchedUser.first_name} ${fetchedUser.last_name}`);
      }

      setLoading(false);
    };

    if (
      location.pathname.startsWith("/users") ||
      location.pathname.startsWith("/photos")
    ) {
      fetchUserData();
    }
  }, [location.pathname]);

  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Hai Nguyen
        </Typography>
        <Box>
          {loading ? (
            <Typography variant="h6" color="inherit">
              Loading...
            </Typography>
          ) : (
            <Typography variant="h6" color="inherit">
              {location.pathname.startsWith("/photos")
                ? `Photos of ${userName}`
                : `${userName}`}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
