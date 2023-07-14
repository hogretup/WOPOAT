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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AuthContext from "../context/AuthContext";

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

  // Handling "Copied!" message after copying seed to clipboard
  const [copied, setCopied] = useState(false);
  const handleCopyToClipBoard = async (seed) => {
    await navigator.clipboard.writeText(seed);
    setCopied(true);

    // Reset the copied state after a certain duration
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // UTC datetime format to SGT converter (update to users' local timezone?)
  const convertTime = (utcDateString) => {
    var utcDate = new Date(utcDateString);

    var options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    // Converts to runtime's default timezone
    var convertedDate = utcDate.toLocaleString("en-GB", options);

    return convertedDate;
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
      state: { quiz: quiz, topic: topic, difficulty: difficulty },
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
        state: { quiz: quiz, topic: quiz.topic, difficulty: quiz.difficulty },
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
        <Typography variant="h6">Got a quiz seed?</Typography>
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

      <TableContainer component={Paper} sx={{ mb: "2rem" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Date/Time</TableCell>
              <TableCell align="right">Seed</TableCell>
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
                <TableCell align="right">{convertTime(item.created)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    onClick={() => handleCopyToClipBoard(item.seed)}
                  >
                    {copied ? "Copied!" : <ContentPasteIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default HomePage;
