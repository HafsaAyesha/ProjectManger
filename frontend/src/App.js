import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Generic layout
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./Pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./Pages/Dashboard";
import KanbanPage from "./Pages/KanbanPage";

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <Routes>

        {/* DEFAULT page → Dashboard */}
        <Route
          path="/"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/login" />
          }
        />

        {/* Home moved to /home (optional) */}
        <Route path="/home" element={<Home />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login setUser={setUser} />
              <Footer />
            </>
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register setUser={setUser} />
              <Footer />
            </>
          }
        />

        {/* Kanban Page */}
        <Route
          path="/kanban"
          element={
            user ? (
              <KanbanPage userId={user._id} email={user.email} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
