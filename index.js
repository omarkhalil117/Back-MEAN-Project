const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const globalErrorHandling = require('./controllers/errorController');
const userRoutes = require('./routes/user');
const AppError = require('./utils/appError');

dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.use('/users', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError('not found', 404));
});

app.use(globalErrorHandling);

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
