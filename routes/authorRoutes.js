const express = require('express');
const multer = require('multer');
const {
  getAll, addAuthor, updateAuthor, deletAuthor, getOne,
} = require('../controllers/authorController');

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

router.get('/:id', async (req, res) => {
  try {
    const author = await getOne(req.params.id);
    return res.json(author);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post('/', upload.single('photo'), async (req, res) => {
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
router.patch('/:id', upload.single('photo'), async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deletAuthor(req.params.id);
    return res.json(deleted);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
