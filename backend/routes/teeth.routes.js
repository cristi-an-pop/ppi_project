const express = require('express');
const router = express.Router();
const teeth = require('../controllers/tooth.controller');

router.post('/teeth', teeth.create);
router.put('/teeth/:id', teeth.update);
router.get('/cases/:caseId/teeth', teeth.findByCaseId);

module.exports = router;
