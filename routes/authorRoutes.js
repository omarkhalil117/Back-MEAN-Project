const express = require('express');
const {
  getAll, addAuthor, updateAuthor, deletAuthor, getOne,
} = require('../controllers/authorController');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', async (req, res) => {
  try {
    const author = await getOne(req.params.id);
    return res.json(author);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newAuthor = await addAuthor(req.body);
    return res.json(newAuthor);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const update = await updateAuthor(req.params.id, req.body);
    return res.json(update);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deletAuthor(req.params.id);
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
