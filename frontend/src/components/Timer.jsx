// components/Timer.jsx
import React from 'react';

const Timer = ({ timeLeft, onBreak }) => {
  return (
    <div className="text-lg md:text-xl text-gray-800">
      {onBreak ? 'Break Time: ' : 'Focus Time: '}
      {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
    </div>
  );
};

export default Timer;
