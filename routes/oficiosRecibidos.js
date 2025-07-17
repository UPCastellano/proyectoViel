const express = require('express');
const router = express.Router();
const OficioRecibido = require('../models/OficioRecibido');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware de autenticación (puedes reutilizar el de oficios.js)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Mostrar formulario para crear oficio recibido
router.get('/crear-recibido', ensureAuthenticated, async (req, res) => {
    const usuarios = await User.findAll();
    res.render('crear-oficio-recibido', { usuarios });
});

// Procesar formulario de creación
router.post('/crear-recibido', ensureAuthenticated, upload.single('archivo'), async (req, res) => {
    const { numero_oficio, asunto, fecha, encargado_id, area, estado } = req.body;
    let archivo = null;
    if (req.file) {
        archivo = req.file.buffer; // El archivo ya está en memoria
    }
    try {
        await OficioRecibido.create({
            numero_oficio,
            asunto,
            fecha,
            encargado_id,
            area,
            estado,
            archivo
        });
        res.redirect('/oficios/recibidos');
    } catch (error) {
        console.error('Error al crear oficio recibido:', error);
        res.status(500).send('Error al crear oficio recibido');
    }
});

// Mostrar lista de oficios recibidos
router.get('/recibidos', ensureAuthenticated, async (req, res) => {
    try {
        const oficios = await OficioRecibido.findAll({ include: [{ model: require('../models/User'), as: 'encargado', attributes: ['email'] }] });
        res.render('lista-oficios-recibidos', { oficios });
    } catch (error) {
        console.error('Error al obtener oficios recibidos:', error);
        res.status(500).send('Error al obtener oficios recibidos');
    }
});

// Ruta para visualizar el archivo de un oficio recibido
router.get('/descargar-archivo/:id', ensureAuthenticated, async (req, res) => {
    try {
        const oficio = await OficioRecibido.findByPk(req.params.id);
        if (!oficio || !oficio.archivo) {
            return res.status(404).send('Archivo no encontrado');
        }
        
        // Detectar el tipo de archivo basado en el contenido
        const buffer = oficio.archivo;
        let contentType = 'application/octet-stream';
        
        // Detectar PDF
        if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
            contentType = 'application/pdf';
        }
        // Detectar imágenes
        else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            contentType = 'image/jpeg';
        }
        else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            contentType = 'image/png';
        }
        // Detectar documentos de Office
        else if (buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
        
        res.setHeader('Content-Type', contentType);
        
        // Para PDFs y otros tipos que se pueden mostrar en el navegador, no forzar descarga
        if (contentType === 'application/pdf' || contentType.startsWith('image/')) {
            res.send(buffer);
        } else {
            // Para otros tipos de archivo, forzar descarga
            res.setHeader('Content-Disposition', 'attachment; filename=archivo_oficio_' + oficio.id);
            res.send(buffer);
        }
    } catch (error) {
        console.error('Error al visualizar archivo:', error);
        res.status(500).send('Error al visualizar archivo');
    }
});

module.exports = router; 