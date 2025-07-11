const app = require('./config/express')

//Iniciando servidor local host
const PORT = 3000
app.listen(PORT,  '0.0.0.0', () => {
    console.log('servidor rodando...')
})

