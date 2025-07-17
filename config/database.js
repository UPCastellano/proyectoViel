const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bcrqdabgorxksmaomwyw', 'ulai7hrrxvr8qtlk', '6CpHMhsr8GmjTBT0bbt2', {
    host: 'bcrqdabgorxksmaomwyw-mysql.services.clever-cloud.com',
    port: 3306,
    dialect: 'mysql'
});

module.exports = sequelize; 