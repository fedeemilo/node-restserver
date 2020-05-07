const jwt = require('jsonwebtoken');

// ============================
//  Verificar Token
// ============================

let verificaToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) => {
		// Si algo sale mal...
		if (err) {
			// 401 -> no autorizado
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido.',
				},
			});
		}

		req.usuario = decoded.usuario;
		next();
	});
};

// ============================
//  Verificar AdminRole
// ============================
let verificaAdminRole = (req, res, next) => {
	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();
	} else {
		return res.json({
			ok: false,
			err: {
				message: 'El usuario no es administrador',
			},
		});
	}
};

module.exports = {
	verificaToken,
	verificaAdminRole,
};
