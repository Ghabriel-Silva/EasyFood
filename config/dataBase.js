import { configDotenv } from 'dotenv';

//importando módulo mysql2 
const mysql = require('mysql2');
//Criando conexao
const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_DATABASE,
    database: process.env.DB_PORT
})

//Teste de coneção 
conexao.connect(function (erro) {
    if (erro) throw erro;
    console.log('Conecatado com sucesso')
})

module.exports = conexao;