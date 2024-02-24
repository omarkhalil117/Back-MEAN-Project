const Authors = require('../models/Author');
const Books = require('../models/Book')
const getAll = async (req, res) => {
  try {
    const authors = await Authors.find({});
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
  const author = await Authors.find({ _id: id });
  return author;
};

// //////////////////////////////////////////////////////////////

const addAuthor = async (authorData) => {
  const createdAuthor = await Authors.create(authorData);
  return createdAuthor;
};
// //////////////////////////////////////////////////////////////

const updateAuthor = async (id, update) => {
  const updatedAuthor = await Authors.findOneAndUpdate({ _id: id }, update, {
    runValidators: true,
    new: true,
  });
  return updatedAuthor;
};
// //////////////////////////////////////////////////////////////

const deletAuthor = async (id) => {
  const deleted = await Authors.deleteOne({ _id: id });
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

module.exports = {
  getAll,
  addAuthor,
  updateAuthor,
  deletAuthor,
  getOne,
  getAuthorBooks,
};
