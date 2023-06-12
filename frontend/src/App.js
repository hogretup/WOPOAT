import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage"

function App() {
  let topics = ["Expand", "Factorise", "Fractions"];
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/quiz" element={<QuizPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
