const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const router = express.Router();
const Usuario = require('../models/usuario');

/* POST /login */
router.post('/login', (req, res) => {
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

// Configuraciones de Google
async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();

	return {
		nombre: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true,
	};
}

/* POST /google */
router.post('/google', async (req, res) => {
	let token = req.body.idtoken;

	let googleUser = await verify(token).catch((e) => {
		res.status(403).json({
			ok: false,
			err: e,
		});
	});

	Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err,
			});
		}

		if (usuarioDB) {
			if (usuarioDB.google === false) {
				return res.status(400).json({
					ok: false,
					err: {
						message: 'Debe usar su autenticación normal',
					},
				});
			} else {
				let token = jwt.sign(
					{
						usuario: usuarioDB,
					},
					process.env.SEED,
					{expiresIn: '48h'}
				);

				return res.json({
					ok: true,
					usuario: usuarioDB,
					token,
				});
			}
		} else {
			// Si el usuario no existe en nuestra BD
			let usuario = new Usuario();

			usuario.nombre = googleUser.nombre;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = true;
			usuario.password = ':)';

			usuario.save((err, usuarioDB) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err,
					});
				}

				let token = jwt.sign(
					{
						usuario: usuarioDB,
					},
					process.env.SEED,
					{ expiresIn: process.env.CADUCIDAD_TOKEN }
				);

				return res.json({
					ok: true,
					usuario: usuarioDB,
					token,
				});
			});
		}
	});
});

module.exports = router;
