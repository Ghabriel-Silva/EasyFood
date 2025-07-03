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

app.engine('handlebars', engine({
    helpers: {  //Isso cria um helper chamado json, que transforma qualquer objeto ou array em string JSON para ser usado no HTML.
        json: function (context) {
            return JSON.stringify(context);
        }
    }
}));
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
const { error } = require('console');

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
app.use(express.urlencoded({ extended: true })); // para ler dados de formulários com uma estrutura mais simplifida de dados. Essa estrutura irá interpretar os dados apenas como string ou array

//Definindo rota principal 
app.get('/', function (req, res) {
    res.render('form') //Retorno o formulario e vou retornar um json contendo todos produtos
})

//Rota de estoque onde recebo os cadastros
app.get('/estoquedia', function (req, res) {
    const sql = 'SELECT * FROM produtos WHERE ativo = TRUE'

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



    if (!req.files || !req.files.imagem || !produto || !valor || !quantidade || !myUnidade || produto.trim() === '' || valor.trim() === '' || quantidade.trim() === '') {
        req.flash('error_msg', 'Todos campos devem ser preenchidos!');
        return res.redirect('/');
    }

    let imagem = req.files.imagem.name;


    const sql = `INSERT INTO produtos (nome, valor, imagem, quantidade, unidade_medida) VALUES (?, ?, ?,?,?)`;
    const valores = [produto, valor, imagem, quantidade, unidade];

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

app.get('/remover/:codigo', function (req, res) {
    const codigo = req.params.codigo;

    // Primeiro remove do banco
    conexao.query(`UPDATE produtos set ativo = FALSE  WHERE codigo = ?`, [codigo], function (erro, resultado) {
        if (erro) {
            console.log('Erro ao remover do banco:', erro);
            req.flash('error_msg', 'Erro ao inativar produto do banco');
            return res.redirect('/estoquedia');
        }

        req.flash('success_msg', 'Produto removido com sucesso!');
        return res.redirect('/estoquedia');
    });
});

//Rota para ir  editar produto
app.get('/editar/:codigo/:imagem', function (req, res) {
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`

    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro
        res.render('form-editar', {
            produtos: retorno[0]
        })
    })

})
//Rota de pedidos inativos
app.get('/produtos-inativos', function (req, res) {
    const sql = 'SELECT * FROM produtos WHERE ativo = FALSE'
    conexao.query(sql, function (err, retorno) {
        if (err) throw err
        res.render('produtosInativos', { produtos: retorno })
    })
})

//Rota para reativar Produtos
app.get('/reativar-produto/:codigo', function (req, res) {
    const codigo = req.params.codigo
    const sql = `UPDATE produtos SET ativo = TRUE WHERE codigo = ?`
    conexao.query(sql, [codigo], function (erro, retorno) {
        if (erro) throw erro
        req.flash('success_msg', 'Produto Reativado Com Sucesso')
        res.redirect('/produtos-inativos')
    })
})

// Rota para alteração de produtos
app.post('/alterar', function (req, res) {
    const { produto, valor, codigo, quantidade, unidade } = req.body;

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


        const condicaoTexto = (produto !== produtoAtual.nome) || (parseFloat(valor) !== parseFloat(produtoAtual.valor) || parseFloat(quantidade) !== parseFloat(produtoAtual.quantidade) || unidade !== produtoAtual.unidade_medida);
        // Verificar se houve alteração em algum campo
        const textoMudou = condicaoTexto
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
            const sql = `UPDATE produtos SET nome =?, valor=? , quantidade=?, unidade_medida=? WHERE codigo = ?`
            const valores = [produto, valor, quantidade, unidade, codigo]

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
    res.redirect('/estoquedia')
})

//Rota get para exibir o formulario
app.get('/registro-pedido', async (req, res) => {
    const sql = 'SELECT * FROM produtos WHERE quantidade > 0 AND ativo = TRUE '
    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro
        res.render('registro', { produtos: retorno })
    })
})


//Rota para  processar o envio do pedido
app.post('/registro-pedido', async function (req, res) {

    const { cliente, endereco, entrega, produto, quantidade, valor_total, forma_pagamento, pago, observacao } = req.body

    try {
        //Pego valor atual do banco de dados corespondendo ao codigos enviados
        const resultados = await new Promise((resolve, reject) => {
            conexao.query('SELECT * FROM produtos WHERE codigo IN (?)', [produto], function (err, retorno) {
                if (err) reject(err)
                else resolve(retorno) //retorna um aray cotendo os dados objetos
            })
        })

        if (resultados.length === 0) {
            return res.status(404).send('nenhum porduto encontrado!')
        }

        //Atualizo o banco de dados com a nova quantidade
        for (let i = 0; i < produto.length; i++) {
            const codigoProduto = produto[i] //Produto me retorna direto o codigo produto = [94, 95, 96]
            const quantidadePedido = parseFloat(quantidade[i])

            // Encontra o produto no resultado do banco
            const produtoAtual = resultados.find(p => p.codigo == codigoProduto) //Retorna primeiro objeto dentro do array resultados que tenha p.codigo igual ao valor de codigoProduto.

            if (!produtoAtual) {
                return res.status(404).send(`Produto com código ${codigoProduto} não encontrado.`);
            }

            const estoqueAtual = parseFloat(produtoAtual.quantidade)
            const novaQuantidade = estoqueAtual - quantidadePedido

            if (novaQuantidade < 0) {
                return res.status(400).send(`Estoque insuficiente para o produto ${codigoProduto}.`)
            }
            await new Promise((resolve, reject) => {
                conexao.query('UPDATE produtos SET quantidade = ? WHERE codigo = ?', [novaQuantidade, codigoProduto], (err) => {
                    if (err) reject(err)
                    else resolve()
                })
            })
        }

        //Adcionando ao banco de dados os pedidos os valores recebidos da req
        const pedidoId = await new Promise((resolve, reject) => {
            const sql = `INSERT  INTO pedidos(nome_cliente, endereco, valor_total, forma_pagamento, foi_pago, observacao, entrega) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
            const valores = [cliente, endereco, valor_total, forma_pagamento, pago, observacao, entrega]

            conexao.query(sql, valores, function (erro, retorno) {
                if (erro) {
                    console.log('Erro ao adicionar pedidos ao banco de dados:', erro)
                    return reject(erro)
                }

                console.log('Pedidos adicionados adicionados')
                resolve(retorno.insertId)  // <<<< aqui pegamos o pedidoId, no caso o id do pedido em questao
                // O insertId é o ID gerado automaticamente (auto_increment) no banco de dados para o novo registro inserido.
            })

        })

        //Inserir id do pedidos na tabela item pedidos 
        for (let i = 0; i < produto.length; i++) {
            const codigoProduto = produto[i]
            const quantidadePedido = parseFloat(quantidade[i])

            const produtoAtual = resultados.find(p => p.codigo == codigoProduto)
            if (!produtoAtual) {
                return res.status(404).send(`Produto com código ${codigoProduto} não encontrado (na etapa de inserção do item).`);
            }
            const precoUnitario = produtoAtual.valor;

            const valoresItems = [pedidoId, codigoProduto, quantidadePedido, precoUnitario];

            await new Promise((resolve, reject) => {
                conexao.query(
                    `INSERT INTO itens_pedido(pedido_id, produto_id, quantidade, preco_unitario) VALUES(?,?,?,?)`,
                    valoresItems,
                    (erro) => (erro ? reject(erro) : resolve())
                )
            })

        }

        res.redirect('/pedidos');


    } catch (erro) {
        console.error('Erro ao atualizar produtos', erro)
        res.status(500).send('Erro ao atualizar produtos.')
    }

})

//Função para buscar pedido por filtro
function buscaPedidoPorFiltro(filtroWhereSql) {
    return new Promise((resolve, reject) => {
        const sql = `
                SELECT 
                    p.id AS pedido_id, 
                    p.nome_cliente, 
                    p.endereco,
                    p.valor_total,
                    p.forma_pagamento,
                    p.foi_pago,
                    p.observacao,
                    DATE_FORMAT(P.data_pedido,'%d/%m/%Y %H:%i' ) AS data_pedido,
                    p.entrega,
                    ip.quantidade,
                    pr.nome As nome_produto, 
                    ip.preco_unitario

                FROM pedidos p
                JOIN itens_pedido ip ON p.id = ip.pedido_id
                JOIN produtos pr ON pr.codigo = ip.produto_id
                ${filtroWhereSql}
                ORDER BY p.id DESC
            `;
        conexao.query(sql, (err, rows) => {
            err ? reject(err) : resolve(rows)
        })
    })
}
//  Função auxiliar para agrupar
function agruparPedidos(resultado) {
    const pedidosAgrupados = [];

    resultado.forEach(linha => {
        let pedido = pedidosAgrupados.find(p => p.pedido_id === linha.pedido_id);
        if (!pedido) {
            pedido = {
                pedido_id: linha.pedido_id,
                nome_cliente: linha.nome_cliente,
                endereco: linha.endereco,
                valor_total: linha.valor_total,
                forma_pagamento: linha.forma_pagamento,
                foi_pago: linha.foi_pago,
                observacao: linha.observacao,
                data_pedido: linha.data_pedido,
                entrega: linha.entrega,
                itens: []
            };
            pedidosAgrupados.push(pedido);
        }
        pedido.itens.push({
            nome_produto: linha.nome_produto,
            quantidade: linha.quantidade,
            preco_unitario: linha.preco_unitario
        });
    });

    return pedidosAgrupados;
}

//Rota para exibir todos pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const resultado = await buscaPedidoPorFiltro('WHERE p.deletado = FALSE')
        const pedidosAgrupados = agruparPedidos(resultado)
        // Envia para o Handlebars
        res.render('pedidos', { pedidos: pedidosAgrupados });
    } catch (erro) {
        console.error('Erro ao buscar pedidos:', erro);
        res.status(500).send('Erro ao carregar pedidos.');
    }
})

//Rota Para deletar pedido
app.get('/deletar-pedido/:pedido_id', function (req, res) {
    const codigo = req.params.pedido_id
    const sql = `UPDATE pedidos SET deletado = TRUE WHERE id = ?`

    conexao.query(sql, [codigo], function (erro, retorno) {
        if (erro) {
            console.log('erro ao atualizar produto', erro)
            return res.status(500).send('Erro ao deletar Pedido')
        }
        req.flash('success_msg', 'Pedido removido com sucesso')
        res.redirect('/pedidos')
    })
})

//rota de Pedidos deletados
app.get('/pedidos-deletados', async function (req, res) {
    try {
        const resultado = await buscaPedidoPorFiltro('WHERE p.deletado = TRUE')
        const pedidosagrupados = agruparPedidos(resultado)
        res.render('pedidos-deletados', { pedidos: pedidosagrupados })
    } catch (erro) {
        console.error('Erro ao buscar pedidos:', erro);
        res.status(500).send('Erro ao carregar pedidos.');
    }
})

//rota reativar pedidos
app.get('/reativar-pedido/:pedido_id', function (req, res) {
    const codigo = req.params.pedido_id
    const sql = `UPDATE pedidos SET deletado = FALSE WHERE id = ?`
    conexao.query(sql, [codigo], (err, retorno) => {
        if (err) {
            req.flash('error_msg', 'Pedido não Reativado!')
            console.error('Pedido não atualizado', err)
            res.status(500).send('Pedido não atualizado')
        }
        req.flash('success_msg', 'Pedido Reativado!')
        res.redirect('/pedidos-deletados')
    })
})

//rota para imprimir pedido
app.get("/imprimir-pedido/:pedido_id", async (req, res) => {
    const pedidoId = req.params.pedido_id;

    const dadosPedido = await buscaPedidoPorFiltro(`WHERE p.id = ${pedidoId}`)
    const dadosAgrupados = agruparPedidos(dadosPedido)


    res.render('impressao', {
        pedidos: dadosAgrupados,
        ocultar_header: true
    });
});


//Iniciando servidor local host
app.listen(8080, function () {
    console.log('servidor rodando...')
})

