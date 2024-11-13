const express = require('express');
const router = express.Router();
const refresh = require('../controllers/refreshToken.controller');

router.get('/refresh', refresh.refreshToken);
router.post('/revoke', refresh.revokeToken);

module.exports = router;
