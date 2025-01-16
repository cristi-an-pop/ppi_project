const express = require('express');
const router = express.Router();
const cases = require('../controllers/case.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer as needed

router.post('/upload', upload.single('image'), cases.uploadImage);

router.post('/cases', cases.create);
router.get('/cases', cases.findByClientId);
router.delete('/cases/:id', cases.delete);
router.put('/cases/:id', cases.update);
router.get('/cases/:id/image', cases.getImage);

//router.put('/cases/:id', verifyAdminRole, cases.update);
router.get('/cases/:id', cases.findOne);

module.exports = router;
