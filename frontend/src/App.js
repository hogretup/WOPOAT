import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";

function App() {
  let topics = ["Expand", "Factorise", "Fractions"];
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/quiz" element={<QuizPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
