const express = require('express');
const router = express.Router();
const cases = require('../controllers/case.controller');
const verifyAdminRole = require('../middlewares/verifyAdminRole');

router.post('/cases', cases.create);
router.get('/cases', cases.findAll);
router.delete('/cases/:id', verifyAdminRole, cases.delete);
//router.put('/cases/:id', verifyAdminRole, cases.update);
router.get('/cases/:id', cases.findOne);

module.exports = router;
