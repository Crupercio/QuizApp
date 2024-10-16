import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Question from './Question';
import Summary from './Summary';
import Timer from './Timer';

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

  const { enqueueSnackbar } = useSnackbar();

  // Fetch questions
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

  // Timer handling
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
      enqueueSnackbar('Correct!', { variant: 'success' });
    } else {
      setIncorrectCount((prev) => prev + 1);
      enqueueSnackbar('Incorrect. The right answers are highlighted in green.', { variant: 'error' });
    }

    setShowCorrectAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setShowCorrectAnswer(false);
      setSelectedOptions([]);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowCorrectAnswer(false);
      setSelectedOptions([]);
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
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
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700">AWS Developer Quiz</h1>
        <Timer timeLeft={timeLeft} onBreak={onBreak} />
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
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            {currentQuestion.questionText}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-sm text-gray-600 mb-4">Hint: {currentQuestion.hint}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(index)}
                className={`w-full py-2 px-4 rounded ${getButtonClass(index)}`}
                disabled={showCorrectAnswer}
              >
                {option.text}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
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
                className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {showSummary && (
        <Summary
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          handleRestartQuiz={handleRestartQuiz}
        />
      )}
    </div>
  );
};

export default QuizApp;
