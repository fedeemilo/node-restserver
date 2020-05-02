require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Mount routes
app.use(require('./routes/index'));

// Home get
app.get('/', (req, res) => {
	res.json('Hello World!');
});

// Connect to database
mongoose.connect(
	process.env.URLDB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	(err, res) => {
		if (err) throw new err();
		console.log('Base de datos ONLINE');
	}
);

// Escuchando el puerto
app.listen(process.env.PORT, () => {
	console.log('Escuchando puerto: ', process.env.PORT);
});
