import { Typography, Container, Paper } from "@mui/material";
import React from "react";
import { LoremIpsum } from "react-lorem-ipsum";

function AboutPage() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ marginTop: "2rem", padding: 8 }}>
        <Typography variant="h5">About</Typography>
        <LoremIpsum />
      </Paper>
    </Container>
  );
}
export default AboutPage;
