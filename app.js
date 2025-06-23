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
    res.render('form') //Retorno o formulario e vou retornar um json contendo todos produtos
})

//Rota de estoque onde recebo os cadastros
app.get('/estoquedia', function (req, res) {
    const sql = 'SELECT * FROM produtos'

    conexao.query(sql, function (erro, retorno) {
        if (erro) {
            console.log('Erro ao buscar no banco de dados')
            req.flash('error_msg', 'Erro ao carregar os produtos do estoque.');
            return res.redirect('/');

        }
        res.render('estoquedia', { produtos: retorno })
    })
})





//Rota de cadastro 
app.post('/cadastrar', function (req, res) {
    //Obter os dados que seram utilizados para cadastro
    const { produto, valor, quantidade, unidade } = req.body;
   const unidadeValidadas = ['kg', 'g', 'un', 'n']
   // Verifica se a unidade está dentro dos valores permitidos
   const myUnidade = unidadeValidadas.includes(unidade)



    if (!req.files || !req.files.imagem || !produto || !valor || !quantidade || !myUnidade|| produto.trim() === '' || valor.trim() === '' || quantidade.trim() === '') {
        req.flash('error_msg', 'Todos campos devem ser preenchidos!');
        return res.redirect('/');
    }

    let imagem = req.files.imagem.name;


    const sql = `INSERT INTO produtos (nome, valor, imagem, quantidade, unidade_medida) VALUES (?, ?, ?,?,?)`;
    const valores = [produto, valor, imagem, quantidade, unidade ];

    //Executar  comando no sql
    conexao.query(sql, valores, function (erro, retorno) {
        //caso ocorra erro 
        if (erro) {
            req.flash('error_msg', 'Erro no banco de dados!');
            return res.redirect('/');
        }
        req.files.imagem.mv(__dirname + '/image/' + imagem, (err) => {
            if (err) {
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

    // Primeiro buscar os dados atuais do produto 
    conexao.query('SELECT * FROM produtos WHERE codigo = ?', [codigo], function (err, resultado) {
        if (err) { //Caso tenha erro ao buscar o produto no banco de dados
            console.error('Erro ao buscar Dados atuais no banco de dados')
            req.flash('error-msg', 'Produto não encontrado')
            return res.redirect('/estoquedia')
        }
        if (resultado.length === 0) { //Se nenhum produto com codigo = atual existir, resultados será um array vazio, ou seja: [].
            req.flash('error_msg', 'Produto não encontrado');
            return res.redirect('/estoquedia')
        }

        const produtoAtual = resultado[0] //Pego o primeiro item do array

        // Verifica se veio uma imagem nova no upload
        const novaImagem = (req.files && req.files.imagem) ? req.files.imagem : null

        // Verificar se houve alteração em algum campo
        const textoMudou = (produto !== produtoAtual.nome) || (parseFloat(valor) !== parseFloat(produtoAtual.valor));
        const imagemMudou = novaImagem !== null

        //Se nada mudou mostrar mensagem e redireciona
        if (!textoMudou && !imagemMudou) {
            req.flash('error_msg', 'Nenhuma alteração detectada.') //Ei, servidor, guarda essa mensagem pra mim e mostra na próxima página!
            return res.redirect('/estoquedia')
        }

        if (imagemMudou) {
            const novoNomeImagem = Date.now() + '-' + novaImagem.name

            //Montar o sql para para atualizar o nome e imagem no banco de dados
            const sql = `UPDATE produtos SET nome = ?, valor= ? , imagem =? WHERE codigo=?`
            const valores = [produto, valor, novoNomeImagem, codigo]

            //Executando o update no banco de dados
            conexao.query(sql, valores, function (err, restorno) {
                if (err) {
                    req.flash('error_msg', 'Erro ao atualizar produto!')
                    return res.redirect('/estoquedia')
                }
                //se n tiver nenhum erro ai vou remover a imagem atual do diretório
                const caminhoImagemAntiga = path.join(__dirname, 'image', produtoAtual.imagem)
                if (fs.existsSync(caminhoImagemAntiga)) {
                    fs.unlink(caminhoImagemAntiga, function (erro) {
                        if (erro) console.log('Erro ao remover imagem antiga:', erro)
                    })
                }

                //Salvando nova imagem
                novaImagem.mv(path.join(__dirname, 'image', novoNomeImagem), (erro) => {
                    if (erro) {
                        console.log('Erro ao salvar imagem', erro)
                        req.flash('error_msg', 'Erro ao salvar a imagem!')
                        return res.redirect('/estoquedia')
                    }
                    req.flash('success_msg', 'Produto atualizado com sucesso!')
                    return res.redirect('/estoquedia')
                })
            })
        } else {
            //Se mudou so o texto, produto, valor
            const sql = `UPDATE produtos SET nome =?, valor=? WHERE codigo = ?`
            const valores = [produto, valor, codigo]

            conexao.query(sql, valores, function (erro, retorno) {
                if (erro) {
                    console.log('Erro ao atualizar produto!', erro)
                    req.flash('error_msg', 'Erro ao atualizar produto!')
                    return res.redirect('/estoquedia')
                }
                req.flash('success_msg', 'Produto atualizado com sucesso!')
                return res.redirect('/estoquedia')
            })
        }

    })

});

//Rota para cancelar a edição do produtos
app.get('/cancelar', function (req, res) {
    res.redirect('/')
})


//Iniciando servidor local host
app.listen(8080, function () {
    console.log('servidor rodando...')
})

