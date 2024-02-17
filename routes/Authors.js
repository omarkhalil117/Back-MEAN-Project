const express = require('express');
const { getAll, addAuthor, updateAuthor, deletAuthor, getOne } = require('../controllers/Authors');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getOne);

router.post('/', (req, res) => {
  try {
    const newAuthor = addAuthor(req.body);
    console.log(req.body);
    if (!newAuthor) {
      return res.status(400).json({ message: 'Bad request' });
    }
  return res.json(newAuthor);
  } catch (err) {
    return res.status(400).json({ message: 'Bad request' });
  }
});

router.patch('/:id', updateAuthor);

router.delete('/:id', deletAuthor);

module.exports = router;
