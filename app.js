import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connnectDB from './database/connect.js';

import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import tweetRoutes from './routes/tweet.js';

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tweet', tweetRoutes);
//app.use(verifyToken);
//app.use(handleError);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connect to DB
    await connnectDB();
    app.listen(port, console.log(`Server listening on port ${port}....`));
  } catch (error) {
    console.log(error);
  }
};

start();
