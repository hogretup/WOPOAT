import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import AuthContext from "../context/AuthContext";
import QuizTable from "../components/QuizTable";

function HomePage() {
  // Selected data values
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [inputSeed, setInputSeed] = useState("");
  const [wrongSeed, setWrongSeed] = useState(false);

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleInputSeedChange = (event) => {
    setInputSeed(event.target.value);
  };

  // Handling form submission
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents default behaviour of form submission event

    if (topic === "" || difficulty === "") return;

    // Fetch quiz data from API then routes to quiz page
    let response = await fetch(`/api/generateQuiz/${topic}/${difficulty}`);
    let quiz = await response.json();
    navigate("/quiz", {
      state: {
        quiz: quiz,
        topic: topic,
        difficulty: difficulty,
        completed: false,
        time: null,
      },
    }); // Passes the props to QuizPage.js
  };

  const handleSubmitSeed = async (event) => {
    event.preventDefault();

    if (inputSeed === "") return;

    // Fetch generated quiz from API then routes to quiz page, if successful
    let response = await fetch(`/api/quiz/generateQuizFromSeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seed: inputSeed,
      }),
    });

    if (response.status === 200) {
      setWrongSeed(false);
      let quiz = await response.json();
      navigate("/quiz", {
        state: {
          quiz: quiz,
          topic: quiz.topic,
          difficulty: quiz.difficulty,
          completed: false,
          time: null,
        },
      }); // Passes the props to QuizPage.js
    } else {
      setWrongSeed(true);
    }
  };

  // Form values
  const topics = ["Expand", "Factorise"];
  const difficulties = [1, 2, 3];

  // Retrieving quiz history
  const [quizHistory, setquizHistory] = useState([]);

  // User context
  let { authTokens, logoutUser } = useContext(AuthContext);

  // Effect Hook:
  // Runs the function on the first render
  // And any time any dependency value changes (second argument)
  // In this case second argument is [] so effect is executed
  // only on the first render
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      const response = await fetch(`/api/quiz/recent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      const data = await response.json();

      // Not sure when response would fail
      if (response.status === 200) {
        setquizHistory(data);
      } else if (response.statusText === "Unauthorized") {
        logoutUser();
      }
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

      <Paper
        elevation={3}
        style={{ marginTop: "2rem", marginBottom: "2rem", padding: 8 }}
      >
        <Typography variant="body1" gutterBottom>
          Got a quiz seed?
        </Typography>
        <form onSubmit={handleSubmitSeed}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                label="Enter seed"
                value={inputSeed}
                onChange={handleInputSeedChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
              <Button variant="contained" color="secondary" type="submit">
                Generate quiz!
              </Button>
            </Grid>
          </Grid>
          {wrongSeed ? "Invalid seed" : ""}
        </form>
      </Paper>
      <Box display="flex" justifyContent="center" alignItems="center">
        <QuizTable quizzes={quizHistory} />
      </Box>
    </Container>
  );
}

export default HomePage;
