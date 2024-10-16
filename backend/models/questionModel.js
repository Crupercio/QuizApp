import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true,
  },
}, {
  timestamps: true,
});

 const Question = mongoose.model('Question', questionSchema);
 
 export default Question;
