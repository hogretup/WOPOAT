import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import FriendsPage from "./pages/FriendsPage";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route
                element={
                  <>
                    <Navbar />
                    <Outlet />
                  </>
                }
              >
                <Route path="/quiz" element={<QuizPage />}></Route>
                <Route path="/home" element={<HomePage />}></Route>
                <Route path="/about" element={<AboutPage />}></Route>
                <Route path="/friends" element={<FriendsPage />}></Route>
              </Route>
            </Route>

            <Route path="/" element={<LoginPage />}></Route>

            <Route path="/signup" element={<SignUpPage />}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
