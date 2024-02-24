require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const bookRouter = require('./routes/bookRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// eslint-disable-next-line consistent-return
app.post('/image', upload.single('image'), (req, res, next) => {
  try {
    const file = req.file.filename;

    if (!file) {
      return next(new AppError(`can't find ${file}`, 404));
    }

    return res.status(200).json(file);
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
});

app.use('/books', bookRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.get('/', (_req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
