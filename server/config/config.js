// Puerto
process.env.PORT = process.env.PORT || 3000

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Duración de token de autenticación
process.env.DURACION_TOKEN = 60 * 60 * 60 * 24 * 30

// Semilla de autenticación
process.env.SEMILLA_AUTENTICACION = process.env.SEMILLA_AUTENTICACION || 'este-es-el-seed-de-desarrollo'

// Base de datos
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI // MONGO_URI es una variable de entorno configurada en Heroku

// Google client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '512364339891-11rgkqsiarkb19lqqb79rohee21nf88k.apps.googleusercontent.com'