// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de Datos
// ============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/vinito';
} else {
    urlDB = 'mongodb+srv://fedeemilo:A0hvzFl48cNIZGy2@cluster0-9zuxs.mongodb.net/vinito';
}

process.env.URLDB = urlDB;



