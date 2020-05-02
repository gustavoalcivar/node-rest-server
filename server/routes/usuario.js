const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')
const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    let limite = req.query.limite || 5
    Usuario.find({estado: true}, 'nombre email rol estado google img') // El segundo parámetro indica los campos que queremos obrener en la consulta
        .skip(Number(desde)) // Estas variables serán leídas en la url (...?desde=5&limite=5)
        .limit(Number(limite))
        .exec((err, usuarios) => {
            if(err) return res.status(400).json({ok: false, err})
            Usuario.countDocuments({estado: true}, (err, conteo) => {
                if(err) return res.status(400).json({ok: false, err})
                res.json({ok: true, usuarios, conteo})
            })
        })
})

app.post('/usuario/', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        rol: body.rol
    })

    usuario.save((err, usuarioDB) => {
        if(err) return res.status(400).json({ok: false, err})

        //usuarioDB.contrasena = null

        res.json({ok: true, usuario: usuarioDB})
    })
})

app.put('/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id

    // pick se usa para indicar los atributos del objeto que si se pueden actualizar
    let body = _.pick(req.body, ['nombre', 'img', 'rol', 'estado'])
    
    // new: true indica que se retorne el registro actualizado (por defecto lo retorna con los datos antes de ser actualizado)
    // runValidators: true corre las validaciones del esquema (modelo)
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) return res.status(400).json({ok: false, err})
        if(!usuarioDB) return res.status(400).json({ok: false, err: {message: 'Usuario no encontrado'}})
        res.json({ok: true, usuario: usuarioDB})
    })
})

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) return res.status(400).json({ok: false, err})
        if(!usuarioBorrado) return res.status(400).json({ok: false, err: {message: 'Usuario no encontrado'}})
        res.json({ok: true, usuarioBorrado})
    })*/
    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) => {
        if(err) return res.status(400).json({ok: false, err})
        if(!usuarioBorrado) return res.status(400).json({ok: false, err: {message: 'Usuario no encontrado'}})
        res.json({ok: true, usuario: usuarioBorrado})
    })
})

module.exports = app