const Author = require('../models/Author');
const Books = require('../models/Book')
const getAll = async (req, res) => {
  try {
    const authors = await Author.find({});
    if (!authors) {
      return res.status(404).json({ message: 'No authors found' });
    }
    return res.json(authors);
  } catch (err) {
    return res.status(404).json({ message: 'Not found' });
  }
};
// //////////////////////////////////////////////////////////////

const getOne = async (id) => {
  const author = await Author.find({ _id: id });
  return author;
};

// //////////////////////////////////////////////////////////////

const addAuthor = async (authorData) => {
  const createdAuthor = await Author.create(authorData);
  return createdAuthor;
};
// //////////////////////////////////////////////////////////////

const updateAuthor = async (id, update) => {
  const updatedAuthor = await Author.findOneAndUpdate({ _id: id }, update, {
    runValidators: true,
    new: true,
  });
  return updatedAuthor;
};
// //////////////////////////////////////////////////////////////

const deletAuthor = async (id) => {
  const deleted = await Author.deleteOne({ _id: id });
  return deleted;
};

// //////////////////////////////////////////////////////////////

const getAuthorBooks = async (id) => {
  const authorBooks = await Books.aggregate([
    {$unwind:'$authorID'},
    {$match : {authorID: id}}
  ]);
  return authorBooks;
}

// //////////////////////////////////////////////////////////////

const getAuthorPage = async (pageNum) => {
  console.log("running")
  const limit = 5 ;
  const authors = await Author.find({}).sort({ _id:1 })
  .skip(pageNum > 0 ? ( ( pageNum - 1 ) * limit ) : 0)
  .limit(limit)
  return authors;
}
module.exports = {
  getAll,
  addAuthor,
  updateAuthor,
  deletAuthor,
  getOne,
  getAuthorBooks,
  getAuthorPage
};
