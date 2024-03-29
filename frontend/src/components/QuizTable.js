import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

function QuizTable({ quizzes, ranking }) {
  // Quizzes is an array of quizzes
  // ranking = true means we want the top3 quiz table (with medals)

  const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

  // Handling "Copied!" message after copying seed to clipboard
  const [copied, setCopied] = useState([]);
  const handleCopyToClipBoard = async (seed, index) => {
    await navigator.clipboard.writeText(seed);

    // Set copied state
    setCopied((copied) => {
      const newCopied = [...copied];
      newCopied[index] = true;
      return newCopied;
    });

    // Reset the copied state after a certain duration
    setTimeout(() => {
      setCopied((copied) => {
        const newCopied = [...copied];
        newCopied[index] = false;
        return newCopied;
      });
    }, 1000);
  };

  // UTC datetime format to SGT converter (update to users' local timezone?)
  const convertTime = (utcDateString) => {
    var utcDate = new Date(utcDateString);

    var options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };

    // Converts to runtime's default timezone
    var convertedDate = utcDate.toLocaleString("en-GB", options);

    return convertedDate;
  };

  // Handling viewing of past quizzes
  const navigate = useNavigate();
  const handleViewQuiz = async (completedQuiz) => {
    console.log(completedQuiz);
    let quiz = completedQuiz.quiz;
    navigate("/quiz", {
      state: {
        quiz: quiz,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        time: completedQuiz.time,
        completed: true,
      },
    });
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ mb: "2rem", maxWidth: 650 }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {quizzes.length === 0 ? (
              <TableCell>
                You have not completed any quizzes yet. Try one to view your
                quiz history!
              </TableCell>
            ) : (
              <>
                <TableCell>Topic</TableCell>
                <TableCell align="right">Difficulty</TableCell>
                <TableCell align="right">Score</TableCell>
                <TableCell align="right">Timing</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Seed</TableCell>
                <TableCell align="right"></TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        {quizzes.length > 0 && (
          <TableBody>
            {quizzes.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {ranking ? medals[index] + item.topic : item.topic}
                </TableCell>
                <TableCell align="right">{item.difficulty}</TableCell>
                <TableCell align="right">
                  {item.score + "/" + item.maxscore}
                </TableCell>
                <TableCell align="right">{item.time + "s"}</TableCell>
                <TableCell align="right">{convertTime(item.created)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    edge="start"
                    color="inherit"
                    onClick={() => handleCopyToClipBoard(item.seed, index)}
                  >
                    {copied[index] ? (
                      <p style={{ fontSize: "12px" }}>Copied!</p>
                    ) : (
                      <ContentPasteIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewQuiz(item)}
                    disabled={!item.quiz}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}

export default QuizTable;
