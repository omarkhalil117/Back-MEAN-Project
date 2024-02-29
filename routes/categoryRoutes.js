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
const { specifyRole, protect } = require('../controllers/authController');
router.get('/', getAllCategories);
router.get('/categories', getAllCategories);
router.get('/categories/popular', getPopularCategory);
router.get('/author/popular', getPopularAuthors);
router.get('/categories/:id', getCategoryById);
router.get('/categories/page/:id', pagination);
router.get('/categories/user/:userId', getCategoriesOfUser);
 
 
router.post('/', protect, specifyRole('admin'),createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
