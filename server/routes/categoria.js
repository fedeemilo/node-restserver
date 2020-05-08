const express = require('express');

let {
	verificaToken,
	verificaAdminRole,
} = require('../middlewares/autenticacion');

const router = express.Router();
let Categoria = require('../models/categoria');
let Usuario = require('../models/usuario');

// =============================
// Mostrar todas las categorías
// =============================
router.get('/', (req, res) => {
    Categoria.find({})
    .sort('descripcion')
		.populate('usuario', 'nombre email')
		.exec((err, categorias) => {
			if (err) {
				res.status(500).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				categorias,
			});
		});
});

// =============================
// Mostrar una categoria por ID
// =============================
router.get('/:id', verificaToken, (req, res) => {
	let id = req.params.id;

	Categoria.findById(id, (err, categoriaDB) => {
		if (err) {
			res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaDB) {
			res.status(500).json({
				ok: false,
				err: {
					message: 'El ID no es correcto',
				},
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB,
		});
	});
});

// =============================
// Crear nueva categoría
// =============================
router.post('/', verificaToken, (req, res) => {
	let body = req.body;

	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id,
	});

	categoria.save((err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB,
		});
	});
});

// =============================
// Actualiza la categoría por ID
// =============================
router.put('/:id', verificaToken, (req, res) => {
	let id = req.params.id;
	let body = req.body;

	let descCategoria = {
		descripcion: body.descripcion,
	};

	Categoria.findByIdAndUpdate(
		id,
		descCategoria,
		{ new: true, runValidators: true },
		(err, categoriaDB) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			if (!categoriaDB) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				categoria: categoriaDB,
			});
		}
	);
});

// =============================
// Borra la categoróa por ID
// =============================
router.delete('/:id', [verificaToken, verificaAdminRole], (req, res) => {
	// solo un admin puede borrar categorías
	let id = req.params.id;

	Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El ID no existe',
				},
			});
		}

		res.json({
			ok: true,
			message: 'Categoria Borrada',
		});
	});
});

module.exports = router;
