const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Acta extends Model {}

Acta.init({
    tipo_reunion: {
        type: DataTypes.ENUM(
            'Gerencia Preinstalaciones',
            'Equipamiento medico',
            'Señales debiles',
            'Minsa-Vielca',
            'Alcaldia',
            'Otro'
        ),
        allowNull: false
    },
    creador_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    temas_abordados: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    participantes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Acta',
    tableName: 'actas'
});

Acta.belongsTo(User, { foreignKey: 'creador_id', as: 'creador' });

module.exports = Acta; 