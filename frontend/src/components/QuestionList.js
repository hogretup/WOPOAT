import React from "react";

const QuestionList = ({
  questions,
  currentQuestionIndex,
  onQuestionChange,
}) => {
  return (
    <div>
      <ul>
        {questions.map((_, index) => (
          <li
            key={index}
            className={currentQuestionIndex === index ? "active" : ""}
            onClick={() => onQuestionChange(index)}
          >
            {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
