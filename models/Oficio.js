const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Oficio extends Model {}

Oficio.init({
    asunto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    responsable: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destinatario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Enviado', 'Recibido'),
        defaultValue: 'Pendiente'
    },
    accion: {
        type: DataTypes.STRING,
        defaultValue: 'Actualizar'
    }
}, {
    sequelize,
    modelName: 'Oficio',
    tableName: 'oficios'
});

module.exports = Oficio;