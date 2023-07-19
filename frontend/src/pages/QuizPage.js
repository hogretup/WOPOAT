import React, { useState, useContext, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MathComponent } from "mathjax-react";
import {
  Container,
  Paper,
  Stack,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Radio,
  Button,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import AuthContext from "../context/AuthContext";

import Confetti from "../components/Confetti";

function QuizPage() {
  // Getting props
  const location = useLocation();
  let { quiz, topic, difficulty, completed } = location.state;

  // Quiz submission variables
  const [selectedOptions, setSelectedOptions] = useState(() =>
    completed ? quiz.selectedOptions : {}
  ); // dict, e.g. { qnIndex: selectedOption }
  const [activeQn, setActiveQn] = useState(0); // int, denotes current active qn
  const [submitted, setSubmitted] = useState(completed); // boolean, denotes whether submit button has been clicked
  const [confettiVisible, setConfettiVisible] = useState(false);

  // Handler
  const handleOptionChange = (event, questionIndex) => {
    // Updates new state based on previous state by passing in function
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: parseInt(event.target.value), // event.target.value = option chosen
    }));
  };

  // Handler
  const handleToggleQn = (event, newActiveQn) => {
    // if no change detected, newActiveQn is null
    if (newActiveQn !== null) {
      setActiveQn(newActiveQn);
    }
  };

  // Handler
  const handleNext = (event) => {
    setActiveQn(activeQn + 1);
  };

  // Handler
  const handleSubmit = (event) => {
    setSubmitted(true);
    setConfettiVisible(true);
    setTimerRunning(false);

    let score = 0;
    for (let i = 0; i < quiz.qns.length; ++i) {
      if (selectedOptions[i] === quiz.qns[i].correct) {
        score += 1;
      }
    }

    // Add completed quiz to quiz history
    addToHistory(score, quiz.qns.length);
  };

  // User context
  let { authTokens } = useContext(AuthContext);

  // Adds completed quiz to quiz history
  const addToHistory = async (score, maxscore) => {
    quiz.selectedOptions = selectedOptions;
    await fetch(`/api/quiz/updateHistory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        topic: topic,
        difficulty: difficulty,
        score: score,
        maxscore: maxscore,
        seed: quiz.seed,
        quiz: quiz,
      }),
    });
  };

  // Timer logic (make into a component)
  const [timerRunning, setTimerRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(`00:00`);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setTime(formatTime(seconds));
        console.log(seconds);
        console.log(time);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds, timerRunning]);

  return (
    <Container maxWidth="sm">
      <Stack direction="column" spacing={2} sx={{ mt: "3rem" }}>
        <Box display="flex" justifyContent="center">
          <ToggleButtonGroup
            value={activeQn}
            exclusive
            onChange={handleToggleQn}
          >
            {[...Array(quiz.qns.length).keys()].map((index) => (
              <ToggleButton value={index}>
                <Box
                  bgcolor={
                    submitted
                      ? selectedOptions[index] === quiz.qns[index].correct
                        ? "#c3d9c3"
                        : "lightsalmon"
                      : "transparent"
                  }
                  sx={{ pl: 0.5, pr: 0.5 }}
                >
                  {index + 1}
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Paper elevation={3} style={{ padding: 12 }}>
          <Typography variant="body1">
            {activeQn + 1}. {quiz.statement}
          </Typography>
          <MathComponent
            tex={quiz.qns[activeQn].qn}
            display={true}
            style={{ marginBottom: "2rem" }}
          ></MathComponent>
          <Stack direction="column" alignItems="flex-start" spacing={0}>
            {quiz.qns[activeQn].options.map((option, optionIndex) => (
              <Box
                bgcolor={
                  submitted && quiz.qns[activeQn].correct === optionIndex
                    ? "#c3d9c3"
                    : "transparent"
                }
                sx={{ width: "100%" }}
              >
                <Radio
                  value={optionIndex}
                  checked={selectedOptions[activeQn] === optionIndex}
                  onChange={(event) => {
                    handleOptionChange(event, activeQn);
                  }}
                  disabled={submitted}
                />
                <MathComponent tex={option} display={false} />
              </Box>
            ))}
          </Stack>
        </Paper>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Chip
            label={time}
            color="primary"
            variant={completed ? "filled" : "outlined"}
          />
          <Box display="flex" justifyContent="flex-start">
            <Button
              variant="contained"
              color="primary"
              disabled={activeQn === quiz.qns.length - 1}
              sx={{ mr: "1rem" }}
              onClick={handleNext}
            >
              Next
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={
                ![...Array(quiz.qns.length).keys()].every(
                  (index) => index in selectedOptions
                ) || submitted
              }
              onClick={handleSubmit}
            >
              Submit
            </Button>
            {confettiVisible && <Confetti />}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}

export default QuizPage;
