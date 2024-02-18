const express = require('express')
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} =require('../controllers/categoryController')
 

router.get('/categories',  getAllCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories',  createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id',  deleteCategory);

module.exports = router;
