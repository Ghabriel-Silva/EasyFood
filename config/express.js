const express = require('express');
const fileupload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();

// Config Handlebars
app.engine('handlebars', engine({
    helpers: {
        json: (context) => JSON.stringify(context)
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: '@Gs189970',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Arquivos estáticos
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/imagem', express.static(path.join(__dirname, '../public/image')));
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));

module.exports = app;