const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.contrasena

    return userObject
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} ya existe en la base de datos'})

module.exports = mongoose.model('Usuario', usuarioSchema)