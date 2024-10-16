import express from 'express';
import Question from '../models/questionModel.js'; // Adjust the path

const questionRoutes = express.Router();

// Create a new question
questionRoutes.post('/', async (req, res) => {
  try {
    const { questionText, options, type } = req.body;
    if (!questionText || !options || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const question = new Question({ questionText, options, type });
    await question.save();
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all questions
questionRoutes.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default questionRoutes;

