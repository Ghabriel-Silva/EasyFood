// Importando módulo express
const express = require('express')
const app = express()

//importando o Handlebars
const {engine} = require('express-handlebars') 

//Configuração do express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


//importando módulo mysql2 
const mysql = require('mysql2')

//Criando conexao
const conexao = mysql.createConnection({
    host:'localhost',
    user:'root', 
    password:'@Gs189970', 
    database:'projeto'
})

//Teste de coneção 
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão conecatado com sucesso')
})
 

//Definindo rota principal
app.get('/', function (req, res) {
  res.render('form')
})


//Iniciando servidor local host
app.listen(8080, function(){
    console.log('servidor rodando...')
})