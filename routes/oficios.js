const express = require('express');
const router = express.Router();
const Oficio = require('../models/Oficio'); // Asegúrate de que esta línea sea correcta
const path = require('path');
const fs = require('fs');

// Middleware para asegurar autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Ruta para mostrar el formulario de crear un nuevo oficio
router.get('/crear-nuevo', ensureAuthenticated, (req, res) => {
    res.render('crear-oficio', { user: req.user, oficio: null, editar: false }); // Pasar el objeto user, oficio y editar a la vista
});

// Ruta para crear un nuevo oficio
router.post('/crear', ensureAuthenticated, async (req, res) => {
    const { asunto, fecha, responsable, destinatario, area, estado, observaciones } = req.body;

    try {
        const nuevoOficio = await Oficio.create({
            asunto,
            fecha,
            responsable,
            destinatario,
            area,
            observaciones,
            estado,
            accion: 'Actualizar' // Acción inicial
        });
        res.redirect('/oficios/mis-oficios-enviados'); // Redirigir a la lista de oficios enviados con el prefijo correcto
    } catch (error) {
        console.error('Error al crear el oficio:', error);
        res.status(500).send('Error al crear el oficio');
    }
});


// Ruta para mostrar los oficios enviados
router.get('/mis-oficios-enviados', ensureAuthenticated, async (req, res) => {
    try {
        const oficios = await Oficio.findAll({
            where: { responsable: req.user.email }
        }); // Obtener solo los oficios del usuario autenticado
        const eventos = oficios.map(oficio => ({
            title: oficio.asunto,
            start: oficio.fecha.toISOString().split('T')[0],
        }));
        res.render('mis-oficios-enviados', { oficios, eventos });
    } catch (error) {
        console.error('Error al obtener los oficios:', error);
        res.status(500).send('Error al obtener los oficios');
    }
});

// Ruta para mostrar la lista general de todos los oficios
router.get('/lista-general', ensureAuthenticated, async (req, res) => {
    try {
        const oficios = await Oficio.findAll(); // Obtener todos los oficios
        res.render('lista-general', { oficios });
    } catch (error) {
        console.error('Error al obtener la lista general de oficios:', error);
        res.status(500).send('Error al obtener la lista general de oficios');
    }
});

// Ruta para mostrar solo los oficios en recepción (Enviado o Recibido)
router.get('/recepcion', ensureAuthenticated, async (req, res) => {
    try {
        const oficios = await Oficio.findAll({
            where: {
                estado: ['Enviado', 'Recibido']
            }
        });
        res.render('recepcion', { oficios });
    } catch (error) {
        console.error('Error al obtener los oficios en recepción:', error);
        res.status(500).send('Error al obtener los oficios en recepción');
    }
});

// Ruta para mostrar el formulario de edición de un oficio
router.get('/actualizar/:id', ensureAuthenticated, async (req, res) => {
    try {
        const oficio = await Oficio.findByPk(req.params.id);
        if (!oficio) return res.status(404).send('Oficio no encontrado');
        res.render('crear-oficio', { user: req.user, oficio, editar: true });
    } catch (error) {
        console.error('Error al obtener el oficio:', error);
        res.status(500).send('Error al obtener el oficio');
    }
});

// Ruta para actualizar un oficio
router.post('/actualizar/:id', ensureAuthenticated, async (req, res) => {
    const { asunto, fecha, responsable, destinatario, area, estado, observaciones } = req.body;
    try {
        await Oficio.update({
            asunto,
            fecha,
            responsable,
            destinatario,
            area,
            estado,
            observaciones
        }, {
            where: { id: req.params.id }
        });
        res.redirect('/oficios/mis-oficios-enviados');
    } catch (error) {
        console.error('Error al actualizar el oficio:', error);
        res.status(500).send('Error al actualizar el oficio');
    }
});

// Ruta para descargar la plantilla y editar en Word
router.get('/redactar/:id', ensureAuthenticated, (req, res) => {
    const plantillaPath = path.join(__dirname, '../public/oficio.docx');
    if (fs.existsSync(plantillaPath)) {
        res.download(plantillaPath, 'oficio.docx');
    } else {
        res.status(404).send('Plantilla no encontrada');
    }
});

// Endpoint para obtener conteo de oficios enviados y recibidos
router.get('/estadisticas', ensureAuthenticated, async (req, res) => {
    try {
        const enviados = await Oficio.count({ where: { estado: 'Enviado' } });
        const recibidos = await Oficio.count({ where: { estado: 'Recibido' } });
        res.json({ enviados, recibidos });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Endpoint para obtener todos los oficios como eventos para el calendario
router.get('/eventos', ensureAuthenticated, async (req, res) => {
    try {
        const oficios = await Oficio.findAll({ attributes: ['id', 'asunto', 'fecha', 'estado'] });
        const eventos = oficios.map(o => ({
            id: o.id,
            title: `${o.asunto} (${o.estado})`,
            start: o.fecha,
            color: o.estado === 'Enviado' ? '#007bff' : (o.estado === 'Recibido' ? '#343a40' : '#ffc107')
        }));
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
});

module.exports = router;
