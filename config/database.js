const { Sequelize } = require('sequelize');

// Configuración optimizada para Render con Clever Cloud
const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'mysql://ulai7hrrxvr8qtlk:6CpHMhsr8GmjTBT0bbt2@bcrqdabgorxksmaomwyw-mysql.services.clever-cloud.com:3306/bcrqdabgorxksmaomwyw',
    {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize; 