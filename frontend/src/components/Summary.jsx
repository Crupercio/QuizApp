// components/Summary.jsx
import React from 'react';

const Summary = ({ correctCount, incorrectCount, handleRestartQuiz }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Quiz Completed!</h2>
      <p className="text-green-600">Correct answers: {correctCount}</p>
      <p className="text-red-600">Incorrect answers: {incorrectCount}</p>
      <button
        onClick={handleRestartQuiz}
        className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded mt-4"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default Summary;
