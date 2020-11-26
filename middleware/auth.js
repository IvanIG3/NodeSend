const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

module.exports = (req, res, next) => {
    // Obtener autorizacion del header
    const authHeader = req.get('Authorization');
    if(authHeader) {
        // Obtener JWT
        const token = authHeader.split(' ')[1];
        // Comprobar JWT
        try {
            const infoToken = jwt.verify(token, process.env.SECRETA);
            req.usuario = infoToken;
        } catch (error) {
            res.status(400).json({
                msg: "JWT no válido"
            });
        }
    }
    return next();
};