const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

app.post('/login', (req, res) => {
    let body = req.body

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err) return res.status(400).json({ok: false, err})
        if(!usuarioDB) return res.status(400).json({ok: false, err: {message: 'Usuario o contraseña incorrectos'}})
        if(!bcrypt.compareSync(body.contrasena, usuarioDB.contrasena)) {
            return res.status(400).json({ok: false, err: {message: 'Usuario o contraseña incorrectos'}})
        }
        let token = jwt.sign({usuario: usuarioDB}, process.env.SEMILLA_AUTENTICACION, {expiresIn: process.env.DURACION_TOKEN})       
        res.json({ok: true, usuario: usuarioDB, token})
    })
})

module.exports = app