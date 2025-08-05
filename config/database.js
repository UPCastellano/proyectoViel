const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'bcrqdabgorxksmaomwyw',
    process.env.DB_USER || 'ulai7hrrxvr8qtlk',
    process.env.DB_PASSWORD || '6CpHMhsr8GmjTBT0bbt2',
    {
        host: process.env.DB_HOST || 'bcrqdabgorxksmaomwyw-mysql.services.clever-cloud.com',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Desactivar logs en producción
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize; 