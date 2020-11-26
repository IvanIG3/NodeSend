const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const auth = require('../middleware/auth');

// /api/archivos

router.post('/',
    auth,
    archivosController.subirArchivo
);

router.get('/:archivo',
    archivosController.descargarArchivo,
    archivosController.eliminarArchivo
);

module.exports = router;
