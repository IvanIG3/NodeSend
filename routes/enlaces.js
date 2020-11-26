const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const enlacesController = require('../controllers/enlacesController');

// /api/enlaces/

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty(),
    ],
    auth,
    enlacesController.nuevoEnlace
);

router.get('/',
    enlacesController.listarEnlaces,
);

router.get('/:url',
    enlacesController.verificarURL,
    enlacesController.tienePassword,
    enlacesController.obtenerEnlace
);

router.post('/:url',
    enlacesController.verificarPassword,
    enlacesController.verificarURL,
    enlacesController.obtenerEnlace
);

module.exports = router;