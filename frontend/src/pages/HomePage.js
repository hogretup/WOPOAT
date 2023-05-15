import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

function HomePage() {
  // Selected data values (not neccessarily submitted yet)
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Effect Hook:
  // Runs the function on the first render
  // And any time any dependency value changes
  /*
  useEffect(() => {
    getQuiz();
  }, [topic, difficulty]);
  */

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Neccessary?

    // Is an Effect Hook neccessary??

    if (topic === "" || difficulty === "") return;

    getQuizAndRoute();
  };

  let getQuizAndRoute = async () => {
    if (topic === "" || difficulty === "") return;

    let response = await fetch(`/api/generateQuiz/${topic}/${difficulty}`);
    let quiz = await response.json();
    await navigate("/quiz", {
      state: { quiz: quiz, topic: topic, difficulty: difficulty },
    }); // Passes the props to QuizPage.js
  };

  const topics = ["Expand", "Factorise"];
  const difficulties = [1, 2, 3];

  // Retrieving history
  const [quizHistory, setquizHistory] = useState([]);

  // UseEffect neccessary to perform after render
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      const response = await fetch(`/api/quiz/recent`);
      const data = await response.json();
      setquizHistory(data);
    };

    fetchRecentQuizzes();
    console.log(quizHistory);
    console.log(typeof quizHistory);
  }, []);

  console.log("Hello");
  console.log(quizHistory);
  console.log(typeof quizHistory);

  // -----------------------------------------------

  return (
    <Container maxWidth="md">
      <AppBar
        position="static"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <Toolbar>
          <Typography variant="h6">Quizzicalc</Typography>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <InputLabel id="topic-label">Topic</InputLabel>
            <Select
              labelId="topic-label"
              id="topic"
              value={topic}
              onChange={handleTopicChange}
              fullWidth
            >
              {topics.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              id="difficulty"
              value={difficulty}
              onChange={handleDifficultyChange}
              fullWidth
            >
              {difficulties.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <br></br>
      <div>
        <h3> Recent Quizzes </h3>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Date/Time (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {quizHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.topic}</td>
                <td>{item.difficulty}</td>
                <td>{item.score + "/" + item.maxscore}</td>
                <td>{item.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}

export default HomePage;
