const jwt = require('jsonwebtoken')

// Verificar token
const verificaToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEMILLA_AUTENTICACION, (err, decoded) => {
        if(err) return res.status(401).json({ok: false, err})
        req.usuario = decoded.usuario
        next()
    })
}

// Verificar token
const verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if(usuario.rol !== 'ADMIN_ROLE')
    return res.status(401).json({ok: false, err: {message: 'Usuario no autorizado para realizar esta operación'}})
    next()    
}

module.exports = {verificaToken, verificaAdminRole}