const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

const conectarDB = async () => {
    console.log("Conectando DB...");
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("DB Conectada");
    } catch (error) {
        console.log("Hubo un error al conectar a la DB");
        console.log(error);
        process.exit(1);
    }
};

module.exports = conectarDB;