// src/components/Question.jsx
import React from 'react';

const Question = ({
  question,
  selectedOptions,
  handleAnswerSelection,
  handleSubmitAnswer,
  handleNextQuestion,
  showCorrectAnswer,
  getButtonClass,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          {question.questionText}
        </h2>
        <p className="text-gray-600 mt-2">
          Question {question.index + 1} of {question.total}
        </p>
      </div>
      <div className="grid gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelection(index)}
            className={`py-3 px-4 w-full rounded-lg shadow transition-all duration-300 ${getButtonClass(index)}`}
            disabled={showCorrectAnswer}
          >
            {option.text}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center">
        {!showCorrectAnswer ? (
          <button
            onClick={handleSubmitAnswer}
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded mt-4"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;
