const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const mongoose = require('mongoose');

const authorRoutes = require('./routes/Authors');
const categoryRoutes =require('./routes/categoryRoutes')
const globalErrorHandling = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const bookRouter = require('./routes/bookRoutes');
const cors = require('cors');
const Authors = require('./models/Author');


const app = express();
const port = 3000;

app.use(express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err.message));

app.use(express.json());
app.use(express.static('uploads'));

mongoose
  .connect(process.env.MONGODB_URI_LOCAL)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log(err));

app.use('/users', userRoutes);
app.use('/books', bookRouter);
app.use('/authors', authorRoutes);
app.use('/categories', categoryRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null,uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage, dest:'uploads/'})

app.post('/upload-author-image/:img' , upload.single("image") , async (req , res)=>{

   const file = req.file.filename;
   const originalImage = req.params.img;
   
   const result = await Authors.updateOne({photo:originalImage},{photo:file})
   console.log(result);
   res.json({filename:file});

})
app.use("/users", userRoutes);
app.use("/books", bookRouter);
app.use("/authors", authorRoutes);
app.use("/categories", categoryRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("not found", 404));
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
