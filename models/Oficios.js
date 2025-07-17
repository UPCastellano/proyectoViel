const express = require('express');
const router = express.Router();
const { Oficio } = require('./Oficio'); // Asegúrate de tener el modelo de Oficio

// Ruta para mostrar el formulario de crear un nuevo oficio
router.get('/crear-nuevo', (req, res) => {
    res.render('crear-oficio'); // Renderizar la vista de crear oficio
});

// Ruta para crear un nuevo oficio
router.post('/crear', async (req, res) => {
    const { asunto, fecha, responsable, destinatario, observaciones } = req.body;

    try {
        const nuevoOficio = await Oficio.create({
            asunto,
            fecha,
            responsable,
            destinatario,
            observaciones,
            estado: 'Pendiente', // Estado inicial
            accion: 'Actualizar' // Acción inicial
        });
        res.redirect('/mis-oficios-enviados'); // Redirigir a la lista de oficios enviados
    } catch (error) {
        console.error('Error al crear el oficio:', error);
        res.status(500).send('Error al crear el oficio');
    }
});

// Ruta para mostrar los oficios enviados
router.get('/mis-oficios-enviados', async (req, res) => {
    try {
        const oficios = await Oficio.findAll(); // Obtener todos los oficios
        res.render('mis-oficios-enviados', { oficios }); // Pasar los oficios a la vista
    } catch (error) {
        console.error('Error al obtener los oficios:', error);
        res.status(500).send('Error al obtener los oficios');
    }
});

module.exports = router; 