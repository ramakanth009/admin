import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Sidebar from "./Sidebar";
import NavBar from "./Navbar";
import Dashboard from "./dashboard/Dashboard";
import UserManagement from "./user_management/UserManagement";
import { useAuth } from "../AuthContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
  },
  mainContent: {
    marginLeft: "260px", // Width of the sidebar
    padding: "84px 20px 20px",
    flexGrow: 1,
    transition: "margin-left 0.3s",
    width: "calc(100% - 260px)",
  },
  fullWidth: {
    marginLeft: 0,
    width: "100%",
  },
});

const Main = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isAuthenticated, isCollegeAdmin } = useAuth();

  // If not authenticated or not a college admin, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isCollegeAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box className={classes.root}>
      <NavBar />
      <Box className={classes.contentWrapper}>
        <Sidebar />
        <Box className={classes.mainContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Change this line below */}
            <Route path="/student-management" element={<UserManagement />} />
            {/* To this: */}
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
