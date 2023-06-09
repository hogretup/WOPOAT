import { Typography, Container, Paper } from "@mui/material";
import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";

function AboutPage() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ marginTop: "2rem", padding: 8 }}>
        <Typography variant="h5">About</Typography>
        Quizzicalc is an educational tool for quick generation of algebra
        quizzes. All quizzes are randomly generated, with answers verified using
        symbolic computation! The platform will feature customisable topics and
        difficulty, and an account system to view your recent quiz history. Just
        select your desired topic and difficulty, and start quizzing! <br />
        <br />
        Note: Currently, only "Expand" questions are available.
      </Paper>
    </Container>
  );
}
export default AboutPage;
