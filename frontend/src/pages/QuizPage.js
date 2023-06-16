import React, { useState } from "react";
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
  AppBar,
  Radio,
  Button,
} from "@mui/material";

import { styled } from "@mui/system";

function QuizPage() {
  /*
  const StyledToggleButton = styled(ToggleButton)(
    ({ theme, submitted, correct }) => ({
      backgroundColor: submitted
        ? correct
          ? theme.palette.success
          : theme.palette.error
        : theme.palette.primary,
      "&:hover": {
        backgroundColor: submitted
          ? correct
            ? theme.palette.success
            : theme.palette.error
          : theme.palette.primary,
      },
      "&.MuiToggleButton-root.Mui-selected": {
        backgroundColor: correct ? theme.palette.success : theme.palette.error,
        "&:hover": {
          backgroundColor: correct
            ? theme.palette.success
            : theme.palette.error,
        },
      },
    })
  );*/

  // Getting props

  const location = useLocation();
  const { quiz, topic, difficulty } = location.state;

  /*

  const quiz = {
    statement: "Expand the following expression",
    qns: [
      {
        qn: "b \\left(r - 1\\right)",
        options: ["b r - b", "b r - b", "b r - 2 b", "b r - 3 b"],
        correct: 0,
      },
      {
        qn: "- 6 m \\left(g - 1\\right)",
        options: [
          "- 4 g m + 4 m",
          "- 8 g m + 8 m",
          "- 7 g m + 7 m",
          "- 6 g m + 6 m",
        ],
        correct: 3,
      },
      {
        qn: "b \\left(r - 1\\right)",
        options: ["b r - b", "b r - b", "b r - 2 b", "b r - 3 b"],
        correct: 0,
      },
    ],
  };
  const topic = "Expand";
  const difficulty = 1;*/

  // Quiz submission variables
  const [selectedOptions, setSelectedOptions] = useState({}); // dict, e.g. { qnIndex: selectedOption }
  const [activeQn, setActiveQn] = useState(0); // int, denotes current active qn
  const [submitted, setSubmitted] = useState(false); // boolean, denotes whether submit button has been clicked

  // Handler
  const handleOptionChange = (event, questionIndex) => {
    // Updates new state based on previous state by passing in function
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: parseInt(event.target.value), // event.target.value = option chosen
    }));

    console.log(selectedOptions);
  };

  // Handler
  const handleNext = (event) => {
    setActiveQn(activeQn + 1);
  };

  // Handler
  const handleSubmit = (event) => {
    setSubmitted(true);

    let score = 0;
    for (let i = 0; i < quiz.qns.length; ++i) {
      if (selectedOptions[i] === quiz.qns[i].correct) {
        score += 1;
      }
    }

    // Add completed quiz to quiz history
    addToHistory(score, quiz.qns.length);
  };

  const handleSetActiveQn = (event, index) => {
    setActiveQn(index);
  };

  const addToHistory = async (score, maxscore) => {
    await fetch(`/api/quiz/updateHistory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        difficulty: difficulty,
        score: score,
        maxscore: maxscore,
      }),
    });
  };

  return (
    <Container maxWidth="sm">
      <Stack direction="column" spacing={2} sx={{ mt: "3rem" }}>
        <Box display="flex" justifyContent="center">
          <ToggleButtonGroup
            value={activeQn}
            exclusive
            onChange={handleSetActiveQn}
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
        <Box display="flex" justifyContent="flex-end">
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
        </Box>
      </Stack>
    </Container>
  );

  /*
  return (
    <div>
      <h1>
        {topic} (Level {difficulty})
      </h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index}>
            <h4>
              {index + 1}. {quiz.statement}
            </h4>
            <MathComponent
              tex={question.qn}
              display={false}
              style={{ marginBottom: "2rem" }}
            />
            <br></br>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="radio"
                  id={`option_${index}_${optionIndex}`}
                  name={`quizOption_${index}`}
                  value={optionIndex}
                  checked={selectedOptions[index] === optionIndex}
                  onChange={(event) => {
                    handleOptionChange(event, index);
                  }}
                />
                <label htmlFor={`option_${index}_${optionIndex}`}>
                  <MathComponent tex={option} display={false} />
                </label>
              </div>
            ))}
            <br></br>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );*/
}

export default QuizPage;
