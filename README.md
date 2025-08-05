# Sistema de Gestión de Oficios

Sistema web para la gestión de oficios, actas y documentos oficiales.

## 🚀 Despliegue en Vercel

### Variables de Entorno Requeridas

Configura las siguientes variables de entorno en tu proyecto de Vercel:

#### Base de Datos MySQL (Clever Cloud)
```
DB_HOST=bcrqdabgorxksmaomwyw-mysql.services.clever-cloud.com
DB_USER=ulai7hrrxvr8qtlk
DB_PASSWORD=6CpHMhsr8GmjTBT0bbt2
DB_NAME=bcrqdabgorxksmaomwyw
DB_PORT=3306
```

#### Google OAuth (Opcional - para autenticación)
```
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

#### Configuración del Servidor
```
PORT=3000
SESSION_SECRET=tu_session_secret_aqui
NODE_ENV=production
```

### Pasos para Desplegar

1. **Subir a GitHub:**
   ```bash
   git add .
   git commit -m "Configuración para Vercel"
   git push origin main
   ```

2. **Conectar con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Importa el proyecto

3. **Configurar Variables de Entorno:**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables listadas arriba

4. **Desplegar:**
   - Vercel detectará automáticamente el archivo `vercel.json`
   - El despliegue se realizará automáticamente

### Estructura del Proyecto

```
proyectoViel/
├── app.js                 # Archivo principal
├── vercel.json           # Configuración de Vercel
├── package.json          # Dependencias
├── config/
│   └── database.js       # Configuración de base de datos
├── models/               # Modelos de Sequelize
├── routes/               # Rutas de la aplicación
├── views/                # Plantillas EJS
└── public/               # Archivos estáticos
```

### Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MySQL con Sequelize ORM
- **Autenticación:** Passport.js con Google OAuth
- **Frontend:** EJS, CSS, JavaScript
- **Despliegue:** Vercel

### Funcionalidades

- ✅ Gestión de oficios enviados y recibidos
- ✅ Sistema de autenticación
- ✅ Gestión de actas
- ✅ Subida de archivos
- ✅ Panel de administración
- ✅ Interfaz responsive

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo .env con las variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

### Notas Importantes

- La base de datos debe estar accesible desde Vercel
- Las variables de entorno son obligatorias para el funcionamiento
- El archivo `vercel.json` configura el despliegue automáticamente
