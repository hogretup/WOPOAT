import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
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
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
