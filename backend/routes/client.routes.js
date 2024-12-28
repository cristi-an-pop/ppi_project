const express = require('express');
const router = express.Router();
const clients = require('../controllers/client.controller');

router.post('/clients', clients.create);
router.get('/clients', clients.findAll);
router.delete('/clients/:id', clients.delete);
router.put('/clients/:id', clients.update);
router.get('/clients/:id', clients.findOne);

module.exports = router;
