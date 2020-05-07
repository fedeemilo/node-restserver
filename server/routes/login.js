const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Usuario = require('../models/usuario');

/* POST /login */
router.post('/', (req, res) => {
	let body = req.body;

	// Deseo buscar solo un registro y verificar que email exista
	Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		// Verifico que el usuario ingresado sea igual al de la BD
		// Si no son iguales los usuarios...
		if (!usuarioDB) {
			return res.status(400).json({
				ok: false,
				err: {
					mesage: '(Usuario) o contraseña incorrectos',
				},
			});
		}

		// Uso bcrypt para comprar la clave que esta en la BD con la que ingreso el usuario
		// Si no son iguales las claves...
		if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
			return res.status(400).json({
				ok: false,
				err: {
					mesage: 'Usuario o (contraseña) incorrectos',
				},
			});
		}

		let token = jwt.sign(
			{
				usuario: usuarioDB,
			},
			process.env.SEED,
			{ expiresIn: 60 * 60 * 24 * 30 }
		);

		// Si pasaron las validaciones...
		res.json({
			ok: true,
			usuario: usuarioDB,
			token,
		});
	});
});

/* PUT /login */

module.exports = router;
