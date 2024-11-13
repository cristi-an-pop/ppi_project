const express = require('express');
const router = express.Router();
const members = require('../controllers/member.controller');
const verifyAdminRole = require('../middlewares/verifyAdminRole');

router.post('/members', members.create);
router.get('/members', members.findAll);
router.delete('/members/:id', verifyAdminRole, members.delete);
router.get('/members/birthday', members.findBirthdayToday);
router.put('/members/:id', verifyAdminRole, members.update);
router.get('/members/:id', members.findOne);
router.get('/members/sorted', members.findSortedByBirthday);

module.exports = router;
