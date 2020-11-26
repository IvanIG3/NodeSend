const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const { validationResult } = require('express-validator');


exports.autenticarUsuario = async (req, res, next) => {
    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }
    // Buscar usuario
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        res.status(401).json({
            msg: "El usuario no existe"
        });
        return next();
    }
    // Verificar password y autenticar usuario
    if(bcrypt.compareSync(password, usuario.password)) {
        // Crear JWT
        const infoToken = {
            id: usuario._id,
            nombre: usuario.nombre
        };
        const jwtOptions = {
            expiresIn: '8h'
        };
        const token = jwt.sign(infoToken, process.env.SECRETA, jwtOptions);
        res.json({ token });
    } else {
        res.status(401).json({
            msg: "Password incorrecto"
        });
        return next();
    }
};

exports.usuarioAutenticado = async (req, res) => {
    // Usuario autenticado desde el middleware de auth
    res.json({
        usuario: req.usuario
    });
};