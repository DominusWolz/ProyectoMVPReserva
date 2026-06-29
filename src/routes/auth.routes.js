const express = require('express');
const router = express.Router();
const { register, login, perfil } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', verifyToken, perfil);

module.exports = router;
