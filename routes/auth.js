// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User'); // Assuming User model is in ../models/User.js

// Ruta de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login'); // Renderizar la vista de inicio de sesión
});

// Ruta de autenticación con Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/dashboard'); // Redirigir al dashboard después de iniciar sesión
    }
);

// Ruta del dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const users = await User.findAll();
    res.render('dashboard', { user: req.user, users });
});

// Ruta para redirigir a la pantalla de inicio sin cerrar sesión
router.get('/logout', (req, res) => {
    res.redirect('/login'); // Redirigir a la página de inicio de sesión sin cerrar sesión
});

// Middleware para verificar superusuario
function ensureSuperuser(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.rol === 'superusuario') {
        return next();
    }
    res.status(403).send('Acceso denegado');
}

// Ver todos los usuarios (solo superusuario)
router.get('/usuarios', ensureSuperuser, async (req, res) => {
    const users = await User.findAll();
    res.render('usuarios', { users, user: req.user });
});

// Mostrar formulario para agregar usuario
router.get('/usuarios/agregar', ensureSuperuser, (req, res) => {
    res.render('agregar-usuario', { user: req.user });
});

// Procesar formulario para agregar usuario
router.post('/usuarios/agregar', ensureSuperuser, async (req, res) => {
    const { email, rol } = req.body;
    try {
        await User.create({ email, rol });
        res.redirect('/usuarios');
    } catch (error) {
        res.status(500).send('Error al agregar usuario');
    }
});

// Eliminar usuario
router.post('/usuarios/eliminar/:id', ensureSuperuser, async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.redirect('/usuarios');
    } catch (error) {
        res.status(500).send('Error al eliminar usuario');
    }
});

// Ruta para obtener la gestión de usuarios como fragmento HTML (AJAX)
router.get('/dashboard/usuarios', ensureSuperuser, async (req, res) => {
    const users = await User.findAll();
    res.render('partials/gestion-usuarios', { users, user: req.user, layout: false });
});

module.exports = router;