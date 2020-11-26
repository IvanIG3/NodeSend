const Enlaces = require('../models/Enlace');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const shordid = require('shortid');


exports.nuevoEnlace = async (req, res, next) => {
    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }
    // Crear enlace
    const { nombre, nombre_original } = req.body;
    const enlace = new Enlaces();
    enlace.url = shordid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    // Si usuario autenticado (opcional)
    if(req.usuario) {
        const { password, descargas } = req.body;
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }
        if(descargas) {
            enlace.descargas = descargas;
        }
        enlace.autor = req.usuario.id;
    }
    // Registrar en DB
    try {
        await enlace.save();
        res.json({
            msg: enlace.url
        });
    } catch (error) {
        console.log(error);
    }
    return next();
};

exports.listarEnlaces = async (req, res, next) => {
    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
};

exports.verificarURL = async (req, res, next) => {
    // Verificar que el enlace existe
    const enlace = await Enlaces.findOne({ url: req.params.url });
    if(!enlace) {
        return res.status(404).json({
            msg: "Ese enlace no existe"
        });
    }
    req.enlace = enlace;
    return next();
};

exports.tienePassword = async (req, res, next) => {
    const enlace = req.enlace;
    if(enlace.password) {
        return res.json({
            password: true,
            enlace: enlace.url
        });
    }
    return next();
};

exports.obtenerEnlace = (req, res, next) => {
    const enlace = req.enlace;
    res.json({
        archivo: enlace.nombre,
        password: false
    });
    return next();
};

exports.verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;
    const enlace = await Enlaces.findOne({ url });
    if(bcrypt.compareSync(password, enlace.password)) {
        next();
    } else {
        return res.status(401).json({
            msg: 'Password Incorrecto'
        });
    }
};