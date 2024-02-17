const Authors = require('../models/Authors');

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

const getOne = async (req, res) => {
  try {
    const author = await Authors.find({ _id: req.params.id });
    if (!author) {
      return res.status(404).json({ message: 'No authors found' });
    }
    return author;
  } catch (err) {
    return res.status(404).json({ message: 'No authors' });
  }
};

// //////////////////////////////////////////////////////////////

const addAuthor = async (authorData) => {
  const createdAuthor = await Authors.create(authorData);
  return createdAuthor;
};
// //////////////////////////////////////////////////////////////

const updateAuthor = async (req, res) => {
  try {
    await Authors.findOneAndUpdate({ _id: req.params.id }, req.body);
    return res.json({ message: 'Updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
// //////////////////////////////////////////////////////////////

const deletAuthor = async (req, res) => {
  try {
    await Authors.deleteOne({ _id: req.params.id });
    return res.json({ message: 'Deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  addAuthor,
  updateAuthor,
  deletAuthor,
  getOne,
};
