const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rol: {
        type: DataTypes.ENUM('usuario', 'superusuario'),
        allowNull: false,
        defaultValue: 'usuario'
    },
    // Otros campos que necesites
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;
