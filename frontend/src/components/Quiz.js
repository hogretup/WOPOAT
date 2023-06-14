import React, { useState } from "react";
import Question from "./Question";
import QuestionList from "./QuestionList";

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
    }
  };

  const handleQuestionChange = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption("");
  };

  return (
    <div>
      <Question
        question={questions[currentQuestionIndex].qn}
        options={questions[currentQuestionIndex].options}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
      />
      <button onClick={handleNextQuestion}>Next</button>
      <QuestionList
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionChange={handleQuestionChange}
      />
    </div>
  );
};

export default Quiz;
