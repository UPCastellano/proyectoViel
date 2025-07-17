const express = require('express');
const router = express.Router();
const Acta = require('../models/Acta');
const User = require('../models/User');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/crear-acta', ensureAuthenticated, (req, res) => {
    res.render('crear-acta', { user: req.user });
});

router.post('/crear-acta', ensureAuthenticated, async (req, res) => {
    const { tipo_reunion, fecha, hora, temas_abordados, participantes } = req.body;
    try {
        await Acta.create({
            tipo_reunion,
            creador_id: req.user.id,
            fecha,
            hora,
            temas_abordados,
            participantes
        });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error al crear acta:', error);
        res.status(500).send('Error al crear acta');
    }
});

// Mostrar las actas creadas por el usuario autenticado
router.get('/mis-actas-creadas', ensureAuthenticated, async (req, res) => {
    try {
        const actas = await Acta.findAll({
            where: { creador_id: req.user.id },
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
        res.render('mis-actas-creadas', { actas });
    } catch (error) {
        console.error('Error al obtener actas:', error);
        res.status(500).send('Error al obtener actas');
    }
});

// Mostrar todas las reuniones realizadas (todas las actas de todos los usuarios)
router.get('/reuniones-realizadas', ensureAuthenticated, async (req, res) => {
    try {
        const actas = await Acta.findAll({
            include: [{ model: User, as: 'creador', attributes: ['email'] }],
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });
        res.render('reuniones-realizadas', { actas });
    } catch (error) {
        console.error('Error al obtener reuniones realizadas:', error);
        res.status(500).send('Error al obtener reuniones realizadas');
    }
});

module.exports = router; 