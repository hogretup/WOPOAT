import React from "react";

const Question = ({ question, options, selectedOption, onOptionSelect }) => {
  return (
    <div>
      <h3>{question}</h3>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={index}
            name="option"
            value={option}
            checked={selectedOption === option}
            onChange={() => onOptionSelect(option)}
          />
          <label htmlFor={index}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default Question;
