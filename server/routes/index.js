const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');
const categoriaRoutes = require('./categoria');
const productoRoutes = require('./producto');


router.use('/usuarios', usuarioRoutes);
router.use('/', loginRoutes);
router.use('/categoria', categoriaRoutes);
router.use('/productos', productoRoutes);

module.exports = router;
