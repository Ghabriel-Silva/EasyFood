const app = require('./config/express')

//Iniciando servidor local host
const PORT = 8080
app.listen(PORT, function () {
    console.log('servidor rodando...')
})

