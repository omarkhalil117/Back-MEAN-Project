const express = require('express');

const router = express.Router();
const {
  getAll,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesOfUser,
  getPopularCategory,
  pagination,
} = require('../controllers/categoryController');
const { protect, specifyRole } = require('../controllers/authController');

router.get('/', getAllCategories);
router.get('/popular', getPopularCategory);

// router.get('/:id', protect , getCategoryById);
router.get('/:id', getCategoryById);
// router.get('/page/:id', protect , pagination);
router.get('/page/:id', pagination);
router.get('/user/:userId', protect, getCategoriesOfUser);

router.post('/', protect, specifyRole('admin'), createCategory);
router.patch('/:id', protect, specifyRole('admin'), updateCategory);
router.delete('/:id', protect, specifyRole('admin'), deleteCategory);

module.exports = router;
