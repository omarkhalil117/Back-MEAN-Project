require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthorRoutes = require('./routes/Authors');

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err.message));

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/authors', AuthorRoutes);

app.use((err, req, res) => {
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
