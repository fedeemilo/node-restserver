const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require('../models/usuario');

router.get('/', (req, res) => {});

router.post('/', (req, res) => {
	res.json({
		ok: true,
	});
});

module.exports = router;
