const express = require('express');

const express = require('express');

const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesOfUser,
  getPopularCategory,
  getPopularAuthors,
  pagination
} = require('../controllers/categoryController');

router.get('/categories', getAllCategories);
router.get('/categories/popular', getPopularCategory);
router.get('/author/popular', getPopularAuthors);
router.get('/categories/:id', getCategoryById);
router.get('/categories/page/:id', pagination);
router.get('/categories/user/:userId', getCategoriesOfUser);
 
 
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
