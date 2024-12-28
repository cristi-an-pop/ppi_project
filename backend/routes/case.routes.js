const express = require('express');
const router = express.Router();
const cases = require('../controllers/case.controller');

router.post('/cases', cases.create);
router.get('/cases', cases.findByClientId);
router.delete('/cases/:id', cases.delete);
//router.put('/cases/:id', verifyAdminRole, cases.update);
router.get('/cases/:id', cases.findOne);

module.exports = router;
