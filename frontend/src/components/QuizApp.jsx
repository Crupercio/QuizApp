import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [studySessionSet, setStudySessionSet] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let timerInterval = null;
    if (isTimerRunning && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (onBreak) {
        setOnBreak(false);
        alert('Break over! Ready to continue? Click to resume.');
      } else {
        setOnBreak(true);
        setTimeLeft(300); // 5 minutes break
        alert('Time for a 5-minute break!');
      }
    }

    return () => clearInterval(timerInterval);
  }, [isTimerRunning, timeLeft, onBreak]);

  const handleStudySessionSelection = (minutes) => {
    setTimeLeft(minutes * 60);
    setIsTimerRunning(true);
    setStudySessionSet(true);
  };

  const handleAnswerSelection = (index) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === 'multiple') {
      setSelectedOptions((prevSelected) => {
        const newSelected = [...prevSelected];
        if (newSelected.includes(index)) {
          newSelected.splice(newSelected.indexOf(index), 1);
        } else {
          newSelected.push(index);
        }
        return newSelected;
      });
    } else {
      setSelectedOptions([index]);
    }
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIndexes = selectedOptions;
    const correctOptionIndexes = currentQuestion.options
      .map((option, index) => (option.isCorrect ? index : null))
      .filter((index) => index !== null);

    const isCorrect = selectedOptionIndexes.every((index) =>
      correctOptionIndexes.includes(index)
    ) && selectedOptionIndexes.length === correctOptionIndexes.length;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }
    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowCorrectAnswer(false);
    setSelectedOptions([]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestartQuiz = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setShowSummary(false);
    setSelectedOptions([]);
    setCurrentQuestionIndex(0);
    setShowCorrectAnswer(false);
    setStudySessionSet(false);
    setTimeLeft(0);
    setIsTimerRunning(false);
  };

  const getButtonClass = (index) => {
    const isSelected = selectedOptions.includes(index);
    if (!showCorrectAnswer) return isSelected ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white';
    const option = questions[currentQuestionIndex].options[index];
    if (option.isCorrect) return 'bg-green-500 text-white';
    if (isSelected && !option.isCorrect) return 'bg-red-500 text-white';
    return 'bg-gray-300 text-black';
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">AWS Developer</h1>
        <div className="text-lg md:text-xl text-gray-800">
          {onBreak ? 'Break Time: ' : 'Focus Time: '}
          {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
        </div>
      </div>

      {!studySessionSet && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <p className="text-gray-700">Choose your study session length:</p>
          <div className="flex gap-4">
            <button onClick={() => handleStudySessionSelection(25)} className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded">
              25 minutes
            </button>
            <button onClick={() => handleStudySessionSelection(35)} className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded">
              35 minutes
            </button>
            <button onClick={() => handleStudySessionSelection(45)} className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded">
              45 minutes
            </button>
          </div>
        </div>
      )}

      {studySessionSet && !showSummary && currentQuestion && (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{currentQuestion.questionText}</h2>
            <p className="text-gray-600 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="grid gap-4">
            {currentQuestion.options.map((option, index) => (
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
              <div>
                <p className={`text-${selectedOptions.length && selectedOptions.every(index => currentQuestion.options[index].isCorrect) ? 'green' : 'red'}-600`}>
                  {selectedOptions.length && selectedOptions.every(index => currentQuestion.options[index].isCorrect) ? 'Correct!' : 'Incorrect. The right answers are highlighted in green.'}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded mt-4"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showSummary && (
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
      )}
    </div>
  );
};

export default QuizApp;


