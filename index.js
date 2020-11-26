const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Crear servidor
console.log('Iniciando servidor...');
const app = express();

// Conectar a la DB
conectarDB();

// Habilitar cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
};
app.use(cors(opcionesCors));

// Hacer pública la carpeta de uploads para las descargas
app.use( express.static('uploads') );

// Habilitar leer los valores de un body
app.use(express.json());

// Routes
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

// Listen
const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});