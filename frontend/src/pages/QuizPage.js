import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MathComponent } from "mathjax-react";
// import { xContentTypeOptions } from "helmet"; // ???

function QuizPage() {
  const location = useLocation();
  const { quiz, topic, difficulty } = location.state;

  const navigate = useNavigate();

  // Getting quiz information
  const questions = quiz.qns;

  // Handlers

  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (event, questionIndex) => {
    // Updates new state based on previous state by passing in function
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionIndex]: parseInt(event.target.value), // event.target.value = option chosen
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let score = 0;
    for (let i = 0; i < quiz.qns.length; ++i) {
      if (selectedOptions[i] === quiz.qns[i].correct) {
        score += 1;
      }
    }

    addToHistoryAndRoute(score, quiz.qns.length);
  };

  let addToHistoryAndRoute = async (score, maxscore) => {
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
    navigate("/");
  };

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
  );
}

export default QuizPage;
