require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.all('*', (req, res, next) => {
  next('Error');
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
