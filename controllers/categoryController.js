const mongoose = require('mongoose');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');
 

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const books = await Book.find({ categoryID: req.params.id });
    res.status(200).json({ categorycontent: category, booksbycategory: books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPopularCategory = async (req, res) => {
  try {
    // const pipeline = [
    // { $match: { rating: { $gt:  0 } } },
    // { $group: { _id: "$categoryID", count: { $sum:  1 } } },
    // { $sort: { count: -1 } },
    //  { $limit:  5 }
    // ];

    const pipeline = [
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: '$categoryID', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ];
    const popularCategories = await Book.aggregate(pipeline);
    console.log(popularCategories);
    if (!popularCategories) {
      return res.status(404).json({ message: 'no popular category found' });
    }
    res.status(200).json(popularCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getCategoriesOfUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const bookIds = user.books;

    const categories = await Book.find({ _id: { $in: bookIds } }).populate(
      'categoryID',
    );
    const categoryNames = categories.map((book) => book.categoryID);

    res.status(200).json(categoryNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const newCategory = await category.save();
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 

const pagination =async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const books = await Book.find({ categoryID: req.params.id }).populate(
      'authorID',
    )
      .skip(startIndex)
      .limit(limit)
      .exec();

      res.status(200).json({ categorycontent: category, booksbycategory: books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesOfUser,
  getPopularCategory,
  pagination
};
