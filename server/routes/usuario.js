const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const router = express.Router();
const Usuario = require('../models/usuario');
const {
	verificaToken,
	verificaAdminRole,
} = require('../middlewares/autenticacion');

/* GET /usuario */
router.get('/', verificaToken, (req, res) => {
	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	Usuario.find({ estado: true }, 'nombre email role estado google img')
		.skip(desde)
		.limit(limite)
		.exec((err, usuarios) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			Usuario.countDocuments({ estado: true }, (err, conteo) => {
				res.json({
					ok: true,
					usuarios,
					cantidad: conteo,
				});
			});
		});
});

/* POST /usuario */
router.post('/', [verificaToken, verificaAdminRole], (req, res) => {
	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role,
	});

	usuario.save((err, usuarioDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		res.json({
			ok: true,
			usuario: usuarioDB,
		});
	});
});

/* UPDATE /usuario/:id */
router.put('/:id', [verificaToken, verificaAdminRole], (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true },
		(err, usuarioDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				usuario: usuarioDB,
			});
		}
	);
});

/* DELETE /usuario/:id */
router.delete('/:id', [verificaToken, verificaAdminRole], (req, res) => {
	let id = req.params.id;
	let cambiaEstado = {
		estado: false,
	};

	Usuario.findByIdAndUpdate(
		id,
		cambiaEstado,
		{ new: true },
		(err, usuarioEliminado) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			if (usuarioEliminado === null) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Usuario no encontrado',
					},
				});
			}

			res.json({
				ok: true,
				usuario: usuarioEliminado,
			});
		}
	);
});

module.exports = router;
