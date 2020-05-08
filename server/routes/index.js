const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');


router.use('/usuario', usuarioRoutes);
router.use('/', loginRoutes);

module.exports = router;
