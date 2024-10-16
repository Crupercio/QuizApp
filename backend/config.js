// config.js
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const mongoDB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@pokecombos.dnpxi.mongodb.net/quizDB?retryWrites=true&w=majority&appName=PokeCombos`;

