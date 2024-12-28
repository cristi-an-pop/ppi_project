const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiModels = require('../controllers/ai-model.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/vulnerabilities', upload.single('image'), aiModels.vulnerabilities);
router.post('/segment', upload.single('image'), aiModels.segment);
router.post('/combine', upload.single('image'), aiModels.combine);

module.exports = router;