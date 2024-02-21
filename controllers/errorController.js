const AppError = require('../utils/appError');

const handleJWTError = () => new AppError('Invalid token please login again', 401);

const handleExpiredError = () => new AppError('Your token has been expired, please log in again.');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  //! try to get string in "" as this is the url
  const value = err.keyValue.userName;
  const [keyPattern] = Object.keys(err.keyPattern);
  const message = `${keyPattern} Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  //! nice trick to not to mutate object even if object has reference data type 😉
  let error = JSON.parse(JSON.stringify(err));
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Internal Server Error..';
  if (error.message === 'data and salt arguments required') error = new AppError('Password is requireed', 400);
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleExpiredError();

  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('ERROR 😢', err);
    res.status(500).json({
      status: 'error',
      message: 'Something wrong! Please try again',
    });
  }
};
