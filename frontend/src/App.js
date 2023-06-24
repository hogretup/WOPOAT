import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import PrivateRoutes from "./components/PrivateRoutes";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>

          <Route path="/signup" element={<SignUpPage />}></Route>

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
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
