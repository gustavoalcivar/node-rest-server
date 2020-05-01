// Puerto
process.env.PORT = process.env.PORT || 3000

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Base de datos
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI // MONGO_URI es una variable de entorno configurada en Heroku
