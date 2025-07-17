const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Importar la estrategia de Google
const authRoutes = require('./routes/auth');
const oficiosRoutes = require('./routes/oficios'); // Asegúrate de que esta línea sea correcta
const oficiosRecibidosRoutes = require('./routes/oficiosRecibidos');
const actasRoutes = require('./routes/actas');
const sequelize = require('./config/database'); // Importar la configuración de la base de datos
const User = require('./models/User'); // Importar el modelo de usuario
require('dotenv').config(); // Cargar variables de entorno desde .env
const app = express();

// Configuración de Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Usar variable de entorno
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Usar variable de entorno
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Buscar el usuario en la base de datos
        let user = await User.findOne({ where: { email: profile.emails[0].value } });
        
        // Verificar si el usuario existe y si está autorizado
        if (!user) {
            return done(null, false, { message: 'Usuario no autorizado.' });
        }

        // Si el usuario está autorizado, continuar
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
});

// Configuración de middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error'); // Pasar mensajes de error a las vistas
    next();
});

// Ruta para la raíz
app.get('/', (req, res) => {
    res.redirect('/login'); // Redirigir a la página de inicio de sesión
});

// Redirección automática de /lista-general a /oficios/lista-general
app.get('/lista-general', (req, res) => {
    res.redirect('/oficios/lista-general');
});

// Redirección automática de /recepcion a /oficios/recepcion
app.get('/recepcion', (req, res) => {
    res.redirect('/oficios/recepcion');
});

// Redirección automática de /agregar-oficio a /oficios/crear-recibido
app.get('/agregar-oficio', (req, res) => {
    res.redirect('/oficios/crear-recibido');
});

// Redirección automática de /ver-todos a /oficios/recibidos
app.get('/ver-todos', (req, res) => {
    res.redirect('/oficios/recibidos');
});

// Rutas de autenticación
app.use('/', authRoutes);
app.use('/oficios', oficiosRoutes); // Registrar las rutas de oficios
app.use('/oficios', oficiosRecibidosRoutes);
app.use('/', actasRoutes);

// Servir archivos estáticos
app.use(express.static('public'));

// Probar la conexión a MySQL
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a MySQL establecida con éxito.');
        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });
