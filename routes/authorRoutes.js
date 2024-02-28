const express = require('express');
const {
  getAll, addAuthor, updateAuthor, deletAuthor, getOne, getAuthorBooks, getAuthorPage, findUserAuthors,
} = require('../controllers/authorController');

const router = express.Router();

router.get('/', getAll);

router.get('/:id/page/:num', async (req, res) => {
  try{
    console.log(1111111111111111 , req.params.num , req.params.id)
    const authors = await findUserAuthors(req.params.num , req.params.id);
    console.log(authors)
    return res.json(authors);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
})

router.get('/:id', async (req, res) => {
  try {
    const author = await getOne(req.params.id);
    const authorbooks = await getAuthorBooks(req.params.id);
    return res.json({status:"succes", author , authorbooks});
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
