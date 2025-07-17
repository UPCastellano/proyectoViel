const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class OficioRecibido extends Model {}

OficioRecibido.init({
    numero_oficio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    encargado_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('En supervision', 'Contestado'),
        defaultValue: 'En supervision',
        allowNull: false
    },
    archivo: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'OficioRecibido',
    tableName: 'oficios_recibidos'
});

OficioRecibido.belongsTo(User, { foreignKey: 'encargado_id', as: 'encargado' });

module.exports = OficioRecibido; 