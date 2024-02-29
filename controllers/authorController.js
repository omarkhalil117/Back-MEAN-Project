const Author = require('../models/Author');
const Books = require('../models/Book');
const User = require('../models/User')
const mongoose = require('mongoose');

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
  const limit = 5 ;
  const authors = await Author.find({}).sort({ _id:1 })
  .skip(pageNum > 0 ? ( ( pageNum - 1 ) * limit ) : 0)
  .limit(limit)
  return authors;
}

// //////////////////////////////////////////////////////////////

const findUserAuthors = async (page , id) => {
  const limit = 5;
  const authors = await User.aggregate([
    {$match : { _id : new mongoose.Types.ObjectId(id) } },
    {$project : { _id : 0, books : 1 }},
    {$unwind : '$books'},
    {$lookup : { from:'books' , localField: 'books.book' , foreignField: '_id', as: 'book' } },
    {$unwind : '$book'},
    {$lookup : { from :'authors' , localField: 'book.authorID' , foreignField: '_id' , as: 'author' }},
    {$group : {_id : {authors:'$author'}} },
    {$skip: page > 0 ? ( ( page - 1 ) * limit ) : 0},
    {$limit:limit}
    ]);
  return authors
  
}


const getPopularAuthors = async (req, res) => {
  try {
    const pipeline = [
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: '$authorID', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'authors',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      { $sort: { count: -1 } },
      { $limit: 2 },
    ];
    const popularAuthors = await Books.aggregate(pipeline);
    console.log(popularAuthors);

    res.status(200).json(popularAuthors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  addAuthor,
  updateAuthor,
  deletAuthor,
  getOne,
  getAuthorBooks,
  getAuthorPage,
  findUserAuthors,
  getPopularAuthors
};
