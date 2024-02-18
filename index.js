require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');

const bookRouter = require('./routes/bookRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const port = 3000;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.use('/books', bookRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
