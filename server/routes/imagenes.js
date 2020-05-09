const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const { verificaTokenImg } = require('../middlewares/autenticacion');

router.get('/:tipo/:img', verificaTokenImg, (req, res) => {
	let tipo = req.params.tipo;
	let img = req.params.img;

	let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

	if (fs.existsSync(pathImagen)) {
		res.sendFile(pathImagen);
	} else {
		let noImagePath = path.resolve(__dirname, '../assets/no-image.png');
		res.sendFile(noImagePath);
	}
});

module.exports = router;
