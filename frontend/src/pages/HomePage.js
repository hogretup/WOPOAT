import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

function HomePage() {
  // Selected data values
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  // Handling form submission
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default behaviour of form submission event

    if (topic === "" || difficulty === "") return;

    let response = await fetch(`/api/generateQuiz/${topic}/${difficulty}`);
    let quiz = await response.json();
    navigate("/quiz", {
      state: { quiz: quiz, topic: topic, difficulty: difficulty },
    }); // Passes the props to QuizPage.js
  };

  // Form values
  const topics = ["Expand", "Factorise"];
  const difficulties = [1, 2, 3];

  // Retrieving quiz history
  const [quizHistory, setquizHistory] = useState([]);

  // Effect Hook:
  // Runs the function on the first render
  // And any time any dependency value changes (second argument)
  // In this case second argument is [] so effect is executed
  // only on the first render
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      const response = await fetch(`/api/quiz/recent`);
      const data = await response.json();
      setquizHistory(data);
    };

    fetchRecentQuizzes();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        style={{ marginTop: "2rem", marginBottom: "2rem", padding: 8 }}
      >
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
                Generate quiz!
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: "2rem" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Date/Time (UTC)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizHistory.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.topic}
                </TableCell>
                <TableCell align="right">{item.difficulty}</TableCell>
                <TableCell align="right">
                  {item.score + "/" + item.maxscore}
                </TableCell>
                <TableCell align="right">{item.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default HomePage;
