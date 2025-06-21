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


//Usando o js
app.use('/js', express.static('./js'))

//importando o Handlebars
const { engine } = require('express-handlebars')
//Configuração do express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


//Configurações do uso das libs no app
const session = require('express-session');
const flash = require('connect-flash');

//
app.use(session({
    secret: '@Gs189970',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});





//importando o modulo bootstrap para poder usar no projeto
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

//importando FilesSytem
const fs = require('fs')



//Referenciando a pasta css
app.use('/css', express.static('./css'))

//Referenciando a pasta Imagem
app.use('/imagem', express.static('./image'))


//importando módulo mysql2 
const mysql = require('mysql2');
const { connect } = require('http2');
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
    const { produto, valor } = req.body;

    if (!req.files || !req.files.imagem || !produto || !valor || produto.trim() === '' || valor.trim() === '' ) {
        req.flash('error_msg', 'Todos campos devem ser preenchidos!');
        return res.redirect('/');
    }

    let imagem = req.files.imagem.name;


    const sql = `INSERT INTO produtos (nome, valor, imagem) VALUES (?, ?, ?)`;
    const valores = [produto, valor, imagem];

    //Executar  comando no sql
    conexao.query(sql, valores, function (erro, retorno) {
        //caso ocorra erro 
        if (erro) {
            req.flash('error_msg', 'Erro no banco de dados!');
            return res.redirect('/');
        }
        req.files.imagem.mv(__dirname + '/image/' + imagem, (err)=>{
            if(err){
                req.flash('error_msg', ' Erro ao salvar imagem.');
                return res.redirect('/');
            }
        });
        //Retornar para rota principal
        req.flash('success_msg', ' Produto cadastrado com sucesso!');
        res.redirect('/')
    })
    
})

//Rota para remover produtos
app.get('/remover/:codigo/:imagem', function (req, res) {
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`

    const caminhoImagem = path.join(__dirname, 'image', req.params.imagem); //📦 path é um módulo nativo do Node.js que serve para trabalhar com caminhos de arquivos e pastas de forma segura e compatível com qualquer sistema operacional (Windows, Linux, Mac).
    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro

        //O Fs.unlink faz a remoção de um arquivo pode ser de texto, imagem, pdf, pasta. Eu passo 2 informações o local que esta o arquivo e uma função callBack que é obrigatoria que ira tratar de error
        fs.unlink(caminhoImagem, (erro) => {
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
app.get('/editar/:codigo/:imagem', function (req, res) {
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`

    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro
        console.log(retorno)
        res.render('form-editar', {
            produtos: retorno[0]
        })
    })

})

// Rota para alteração de produtos
app.post('/alterar', function (req, res) {
    const { produto, valor, codigo, nomeImagem } = req.body;

    if (req.files && req.files.imagem) { //  req.files=>	O formulário enviou arquivos no caso do input, o files é um objeto  //req.files.imagem=> O campo de imagem foi preenchido com um arquivo
        const imagem = req.files.imagem //Atribuo a imagem que recebo da requisição 
        const novoNomeImagem = Date.now() + '-' + imagem.name; // evita conflito
        const sql = `UPDATE produtos SET nome=?, valor=?, codigo=?, imagem=? WHERE codigo=?`;

        const valores = [produto, valor, codigo, novoNomeImagem, codigo]

        //Executando a execução
        conexao.query(sql, valores, function (erro, retorno) {
            if (erro) {
                console.error('Erro ao atualizar produtos:', erro)
                return res.status(500).send('Erro no Banco de Dados.')
            }

            //Caminho antigo da imagem
            const caminhoImagemAntiga = path.join(__dirname, 'image', nomeImagem)

            // Remover a imagem antiga, se existir
            if (fs.existsSync(caminhoImagemAntiga)) {
                fs.unlink(caminhoImagemAntiga, (erro) => {
                    if (erro) {
                        console.log('Erro ao remover imagem antiga:', erro);
                    }
                })
            }

            //Salvar a nova imagem
            imagem.mv(path.join(__dirname, 'image', novoNomeImagem), (err) => {
                if (err) {
                    console.error('Erro ao salvar nova imagem:', err);
                    return res.status(500).send('Erro ao salvar nova imagem.');
                }
                res.redirect('/');
            })
        })
    } else {
        //Se nao for atualizado
        const sql = `UPDATE produtos SET nome=?, valor=?, codigo=? WHERE codigo=?`;
        const valores = [produto, valor, codigo, codigo]

        conexao.query(sql, valores, function (erro, retorno) {
            if (erro) {
                console.log('A imagem não foi atualizada')
            }
            res.redirect('/');
        })
    }

});

//Rota para cancelar a edição do produtos
app.get('/cancelar', function (req, res) {
    res.redirect('/')
})


//Iniciando servidor local host
app.listen(8080, function () {
    console.log('servidor rodando...')
})

