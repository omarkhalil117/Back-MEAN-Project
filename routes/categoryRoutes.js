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
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/popular', getPopularCategory);
router.get('/:id', getCategoryById);
router.get('/user/:userId', getCategoriesOfUser);

router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
