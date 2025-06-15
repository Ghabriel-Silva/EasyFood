// Importando módulo express
const express = require('express')

const app = express()

app.get('/', function (req, res) {
    res.write('testando banco de dados!')
    res.end()
})

app.listen(8080, function(){
    console.log('servidor rodando...')
})