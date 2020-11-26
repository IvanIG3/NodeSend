const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {
    // Configurar multer ( para subir archivos )
    const configMulter = {
        limits: {
            // 1mb para usuarios normales, 10mb para usuarios registrados
            fileSize: req.usuario ? (1024 * 1024 * 10) : (1024 * 1024)
        },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                // Subir a la carpeta de uploads
                cb(null, __dirname+'/../uploads');
            },
            filename: (req, file, cb) => {
                // Obtener extension del fichero
                const extension = file.originalname.substring(
                    file.originalname.lastIndexOf('.'), file.originalname.length
                );
                // Generar un nombre más corto para el fichero
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    };
    // Funcion de multer
    const upload = multer(configMulter).single('archivo');
    // Subir archivo
    upload(req, res, async error => {
        if(error) {
            console.log(error);
            return next();
        }
        res.json({
            archivo: req.file.filename
        });
    });
};

// Eliminar archivo
exports.eliminarArchivo = async (req, res, next) => {
    try {
        fs.unlinkSync(`${__dirname}/../uploads/${req.archivo}`);
    } catch (error) {
        console.log(error);
    }
};

// Descarga un archivo
exports.descargarArchivo = async (req, res, next) => {
    const { archivo } = req.params;
    // Descargar archivo
    res.download(`${__dirname}/../uploads/${archivo}`);
    // Post operaciones: restar del número de descargas permitidas y/o eliminar archivo
    const enlace = await Enlaces.findOne({
        nombre: archivo
    });
    enlace.descargas--;
    if( enlace.descargas === 0) {
        // Eliminar archivo
        req.archivo = enlace.nombre;
        next();
        // Eliminar enlace
        await Enlaces.findOneAndRemove({_id: enlace._id});
    } else {
        await enlace.save();
    }  
};