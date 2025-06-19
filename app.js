// Importando módulo express
const express = require('express')

//Importando módulo fileupload
const fileupload = require('express-fileupload')

//Requerindo path
const path = require('path');

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

//importando FilesSytem
const fs = require('fs')



//Referenciando a pasta css
app.use('/css', express.static('./css'))

//Referenciando a pasta Imagem
app.use('/imagem', express.static('./image'))


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
    let sql = 'SELECT * FROM produtos' //Selecionando todos produtos do Banco de dados

    //executando 
    conexao.query(sql, function (erro, retorno) {
        res.render('form', { produtos: retorno }) //Retorno o formulario e vou retornar um json contendo todos produtos
    })

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
    conexao.query(sql, function (erro, retorno) {

        //caso ocorra erro 
        if (erro) throw erro

        //caso ocorra o cadastro
        req.files.imagem.mv(__dirname + '/image/' + req.files.imagem.name);
        console.log(retorno)
    })

    //Retornar para rota principal
    res.redirect('/')

})

//Rota para remover produtos
app.get('/remover/:codigo/:imagem', function (req, res) {
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`

    const caminhoImagem = path.join(__dirname, 'image', req.params.imagem); //📦 path é um módulo nativo do Node.js que serve para trabalhar com caminhos de arquivos e pastas de forma segura e compatível com qualquer sistema operacional (Windows, Linux, Mac).
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro

        //O Fs.unlink faz a remoção de um arquivo pode ser de texto, imagem, pdf, pasta. Eu passo 2 informações o local que esta o arquivo e uma função callBack que é obrigatoria que ira tratar de error
        fs.unlink(caminhoImagem, (erro)=>{
            if (erro) {
                console.log('Falha ao remover a imagem:', erro);
            } else {
                console.log('Imagem removida com sucesso!');
            }
        })
    })

    //Redirecionar
    res.redirect('/')
})

//Rota para ir  editar produto
app.get('/editar/:codigo/:imagem', function(req, res){
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`
    const caminhoImagem = path.join(__dirname, 'image', req.params.imagem)

    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro
        console.log(retorno)
        res.render('form-editar', {
            produtos: retorno[0]
        })
    })

})

//Rota para alteração de produtos
app.post('/alterar', function(req, res){
//obeter os dados do formulário


})


//Rota para cancelar a edição do produtos
app.get('/cancelar', function(req, res){
    res.redirect('/')
})


//Iniciando servidor local host
app.listen(8080, function () {
    console.log('servidor rodando...')
})