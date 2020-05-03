require('./config/config')
const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

// Configuración global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    (err,res) => {
        if(err) return res.status(400).json({ok: false, err})
        console.log('Base de datos online')
})

app.listen(process.env.PORT, () => {
    console.log(`Listening port ${process.env.PORT}`)
})