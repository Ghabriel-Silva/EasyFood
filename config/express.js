// config/express.js
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const fileupload = require('express-fileupload')
const path = require('path')
const { engine } = require('express-handlebars')

// Rotas
const produtosRoute = require('../routes/produto')
const pedidosRoute = require('../routes/pedido')

const app = express()

// Handlebars
app.engine('handlebars', engine({
    helpers: {
        json: context => JSON.stringify(context),
        eq: (a, b) => a == b
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '../views'))


// Middlewares globais
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())

app.use(session({
    secret: '@Gs189970',
    resave: false,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// Pastas públicas
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')))
app.use('/js', express.static(path.join(__dirname, '../js')))
app.use('/css', express.static(path.join(__dirname, '../css')))
app.use('/imagem', express.static(path.join(__dirname, '../image')))

// Rotas
app.use('/', produtosRoute)
app.use('/', pedidosRoute)

module.exports = app
