const conexao = require('../config/dataBase')
const path = require('path');
const fs = require('fs');


module.exports = {
    //Exibir formulario
    exibirFormulario: (req, res) => {
        res.render('form'); // Renderiza o formulário
    },
    //Mostrar produtos ativos
    ativos: (req, res) => {
        const sql = 'SELECT * FROM produtos WHERE ativo = TRUE'

        conexao.query(sql, function (erro, retorno) {
            if (erro) {
                console.log('Erro ao buscar no banco de dados')
                req.flash('error_msg', 'Erro ao carregar os produtos do estoque.');
                return res.redirect('/');
            }
            res.render('estoquedia', { produtos: retorno })
        })
    },

    //Cadastrar novo produto
    cadastrar: (req, res) => {
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
    },

    //remover produtos 
    remover: (req, res) => {
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
    },

    //View editar produto
    editar: (req, res) => {
        let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`

        conexao.query(sql, function (erro, retorno) {
            if (erro) throw erro
            res.render('form-editar', {
                produtos: retorno[0]
            })
        })
    },

    //View inativos
    inativos: (req, res) => {
        const sql = 'SELECT * FROM produtos WHERE ativo = FALSE'
        conexao.query(sql, function (err, retorno) {
            if (err) throw err
            res.render('produtosInativos', { produtos: retorno })
        })
    },

    // reativar Produtos ok
    reativar: (req, res) => {
        const codigo = req.params.codigo
        const sql = `UPDATE produtos SET ativo = TRUE WHERE codigo = ?`
        conexao.query(sql, [codigo], function (erro, retorno) {
            if (erro) throw erro
            req.flash('success_msg', 'Produto Reativado Com Sucesso')
            res.redirect('/produtos-inativos')
        })
    },

    //Alteração de produtos 
    alterar: (req, res) => {
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
    },

    //Cancelar
    cancelar: (req, res) => {
        res.redirect('/estoquedia')
    }

} 