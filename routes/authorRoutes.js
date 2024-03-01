const express = require('express');
const multer = require('multer');
const {
  getAll, addAuthor, updateAuthor, deletAuthor, getOne, getAuthorBooks, findUserAuthors, getPopularAuthors,
} = require('../controllers/authorController');
const { protect, specifyRole } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
//! upload photo
const upload = multer({ storage });

const router = express.Router();

router.get('/', getAll);

router.get('/popular', getPopularAuthors);

router.get('/:id', async (req, res) => {
  try {
    const author = await getOne(req.params.id);
    const authorbooks = await getAuthorBooks(req.params.id);
    return res.json({ status: 'succes', author, authorbooks });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get('/:id/page/:num', async (req, res) => {
  try {
    const authors = await findUserAuthors(req.params.num, req.params.id);
    console.log(authors);
    return res.json(authors);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// router.get('/:id', protect , async (req, res) => {

router.post('/', protect, specifyRole('admin'), upload.single('photo'), async (req, res) => {
  try {
    if (req.file) {
      //! put photo url in body that will be sent to mongodb
      req.body.photo = req.file.filename;
    }
    const newAuthor = await addAuthor(req.body);
    return res.json(newAuthor);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

//! layer for upload will put info in next middleware
router.patch('/:id', protect, specifyRole('admin'), protect, upload.single('photo'), async (req, res) => {
  try {
    console.log(req.body);
    console.log('___________________________________________________________________________________');
    if (req.file) {
      //! put photo url in body that will be sent to mongodb
      req.body.photo = req.file.filename;
    }
    const update = await updateAuthor(req.params.id, req.body);
    return res.json(update);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, specifyRole('admin'), async (req, res) => {
  try {
    const deleted = await deletAuthor(req.params.id);
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
