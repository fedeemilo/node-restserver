const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const router = express.Router();
const Producto = require('../models/producto');

// =================
// Obtener Productos
// =================
router.get('/', verificaToken, (req, res) => {
	// trae todos los productos
	// populate: usuario categoria
	// paginado
	let desde = req.query.desde || 0;
	desde = Number(desde);

	Producto.find({ disponible: true })
		.skip(desde)
		.limit(5)
		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productos) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				productos,
			});
		});
});

// ==========================
// Obtener un Producto por ID
// ==========================
router.get('/:id', verificaToken, (req, res) => {
	// populate: usuario categoria
	// paginado
	let id = req.params.id;

	Producto.findById(id)

		.populate('usuario', 'nombre email')
		.populate('categoria', 'descripcion')
		.exec((err, productoDB) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			if (!productoDB) {
				console.log(err);
				return res.status(400).json({
					ok: false,
					err: {
						message: 'ID no existe',
					},
				});
			}

			res.json({
				ok: true,
				producto: productoDB,
			});
		});
});

// ==========================
// Buscar productos
// ==========================
router.get('/buscar/:termino', verificaToken, (req, res) => {
	let termino = req.params.termino;

	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })
		.populate('categoria', 'nombre')
		.exec((err, productos) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				productos,
			});
		});
});

// ==========================
// Crear un nuevo Producto
// ==========================
router.post('/', verificaToken, (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado
	let body = req.body;

	console.log(req.usuario);

	let producto = new Producto({
		usuario: req.usuario._id,
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		disponible: body.disponible,
		categoria: body.categoria,
	});

	producto.save((err, productoDB) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		res.status(201).json({
			ok: true,
			producto: productoDB,
		});
	});
});

// ==========================
// Actualizar un producto
// ==========================
router.put('/:id', verificaToken, (req, res) => {
	// grabar el usuario
	// grabar una categoria del listado

	let id = req.params.id;
	let body = req.body;

	Producto.findById(id, (err, productoDB) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoDB) {
			console.log(err);
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El ID no existe',
				},
			});
		}

		productoDB.nombre = body.nombre;
		productoDB.precioUni = body.precioUni;
		productoDB.descripcion = body.descripcion;
		productoDB.disponible = body.disponible;
		productoDB.categoria = body.categoria;

		productoDB.save((err, productoGuardado) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				producto: productoGuardado,
			});
		});
	});
});

// ==========================
// Borrar un producto
// ==========================
router.delete('/:id', verificaToken, (req, res) => {
	// pasar disponible a falso
	let id = req.params.id;

	Producto.findById(id, (err, productoDB) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!productoDB) {
			console.log(err);
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El ID no existe',
				},
			});
		}

		productoDB.disponible = false;

		productoDB.save((err, productoBorrado) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				producto: productoBorrado,
				message: 'Producto borrado',
			});
		});
	});
});

module.exports = router;
