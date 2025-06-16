// Importando módulo express
const express = require('express')

//Importando módulo fileupload
const fileupload = require('express-fileupload')

//App
const app = express()

//Habilitando o upload de arquivos no app
app.use(fileupload())

//importando o Handlebars
const { engine } = require('express-handlebars')
//Configuração do express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



//importando o modulo bootstrap para poder usar no projeto
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))


//Referenciando a pasta css
app.use('/css', express.static('./css'))


//importando módulo mysql2 
const mysql = require('mysql2')
//Criando conexao
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Gs189970',
    database: 'projeto'
})

//Teste de coneção 
conexao.connect(function (erro) {
    if (erro) throw erro;
    console.log('Conexão conecatado com sucesso')
})

//manipulação de dados via rotas
app.use(express.json()); //para ler JSON
app.use(express.urlencoded({ extended: false })); // para ler dados de formulários com uma estrutura mais simplifida de dados. Essa estrutura irá interpretar os dados apenas como string ou array

//Definindo rota principal 
app.get('/', function (req, res) {
    res.render('form')
})

//Rota de cadastro 
app.post('/cadastrar', function (req, res) {
    //Obter os dados que seram utilizados para cadastro
    let produto = req.body.produto;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    //Sql 
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${produto}', '${valor}', '${imagem}')`


    //Executar  comando no sql
    conexao.query(sql, function(erro, retorno){

        //caso ocorra erro 
        if(erro) throw erro

        //caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/image/' + req.files.imagem.name);
        console.log(retorno)
    })

    //Retornar para rota principal
    res.redirect('/')

})

//Iniciando servidor local host
app.listen(8080, function () {
    console.log('servidor rodando...')
})