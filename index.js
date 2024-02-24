const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const mongoose = require('mongoose');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const globalErrorHandling = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const bookRouter = require('./routes/bookRoutes');

const app = express();
dotenv.config('.env');
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
dotenv.config('.env');
mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.use('/users', userRoutes);
app.use('/books', bookRouter);
app.use('/authors', authorRoutes);
app.use('/categories', categoryRoutes);

app.all('*', (req, res, next) => {
  next(new AppError('not found', 404));
});

app.use(globalErrorHandling);

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
