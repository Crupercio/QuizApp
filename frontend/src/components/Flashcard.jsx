import React, { useState } from 'react';

// Flashcard.jsx
const Flashcard = ({ topic, content }) => {
    return (
      <div className="bg-white shadow-md p-4 rounded-md">
        <h2 className="font-bold">{topic}</h2>
        <p>{content}</p>
      </div>
    );
  };
  
  export default Flashcard;
  