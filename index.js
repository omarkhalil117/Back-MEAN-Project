require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authorRoutes = require('./routes/authorRoutes');
const bookRouter = require('./routes/bookRoutes');

const categoryRoutes =require('./routes/categoryRoutes')

const app = express();
app.use(cors());
const port = 3000;

mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use('/books', bookRouter);
app.use('/authors', authorRoutes);
app.use(categoryRoutes);
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send('Something broke!');
});
 

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
