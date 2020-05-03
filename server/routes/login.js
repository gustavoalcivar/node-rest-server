const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload() // En el payload, vienen todos los datos del usuario
    //const userid = payload['sub']
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }    
}
    //verify().catch(console.error)

app.post('/google', async (req, res) => {
    let token = req.body.idtoken
    let usuarioGoogle = await verify(token) // Usuario de Google
        .catch(err => {return res.status(403).json({ok: false, err})})
    
    Usuario.findOne({email: usuarioGoogle.email}, (err, usuarioDB) => {
        if(err) return res.status(500).json({ok: false, err})
        if(usuarioDB) {
            if(usuarioDB.google === false) {
                return res.status(400).json({ok: false, err: {message: `El correo ${usuarioDB.email} ya se encuentra en la base de datos, debe usar la autenticación normal`}})
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA_AUTENTICACION, {expiresIn: process.env.DURACION_TOKEN})
                return res.json({ok: true, usuario: usuarioDB, token})
            }
        } else {
            // El usuario no existe en la base de datos
            let usuario = new Usuario({
                nombre: usuarioGoogle.nombre,
                email: usuarioGoogle.email,
                img: usuarioGoogle.img,
                google: true,
                contrasena: ':)' // Sólo para pasar la validación del modelo
            })
            usuario.save((err, usuarioDB) => {
                if(err) return res.status(500).json({ok: false, err})
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA_AUTENTICACION, {expiresIn: process.env.DURACION_TOKEN})
                return res.json({ok: true, usuario: usuarioDB, token})
            })
        }
    })
})

module.exports = app