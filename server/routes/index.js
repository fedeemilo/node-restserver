const express = require('express');
const router = express.Router();
const usuarioRoutes = require('./usuario');
const loginRoutes = require('./login');
const categoriaRoutes = require('./categoria');
const productoRoutes = require('./producto');
const uploadRoutes = require('./upload');
const imagenesRoutes = require('./imagenes');


router.use('/usuarios', usuarioRoutes);
router.use('/', loginRoutes);
router.use('/categoria', categoriaRoutes);
router.use('/productos', productoRoutes);
router.use('/upload', uploadRoutes);
router.use('/imagen', imagenesRoutes);

module.exports = router;
