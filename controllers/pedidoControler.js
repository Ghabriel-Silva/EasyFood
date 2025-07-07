const conexao = require('../config/dataBase')
const path = require('path');
const fs = require('fs');
const { agruparPedidos, buscaPedidoPorFiltro } = require('../helpers/pedidosHelpers')


module.exports = {
    //Exibe o Formulario de pedidos
    formPedidos: (req, res) => {
        const sql = 'SELECT * FROM produtos WHERE quantidade > 0 AND ativo = TRUE '
        conexao.query(sql, function (erro, retorno) {
            if (erro) throw erro
            res.render('registro', { produtos: retorno })
        })
    },

    //Rota para  processar o envio do pedido
    envioPedido: async (req, res) => {
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
}catch (erro) {
            console.error('Erro ao atualizar produtos', erro)
            res.status(500).send('Erro ao atualizar produtos.')
        }
    },

    //Exibe pedidos
    pedidos: async (req, res) => {
        try {
            const resultado = await buscaPedidoPorFiltro('WHERE p.deletado = FALSE AND p.concluido = FALSE')
            const pedidosAgrupados = agruparPedidos(resultado)
            // Envia para o Handlebars
            res.render('pedidos', { pedidos: pedidosAgrupados });
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro);
            res.status(500).send('Erro ao carregar pedidos.');
        }
    },

    //Rota Para deletar pedido
    deletarPedido: (req, res) => {
        const codigo = req.params.pedido_id
        const sql = `UPDATE pedidos SET deletado = TRUE WHERE id = ?`

        conexao.query(sql, [codigo], function (erro, retorno) {
            if (erro) {
                console.log('erro ao atualizar produto', erro)
                return res.status(500).send('Erro ao deletar Pedido')
            }
            req.flash('success_msg', `Pedido removido #${codigo} com sucesso`)
            res.redirect('/pedidos')
        })
    },

    //rota de Pedidos deletados
    pedidosDeletados: async (req, res) => {
        try {
            const resultado = await buscaPedidoPorFiltro('WHERE p.deletado = TRUE')
            const pedidosagrupados = agruparPedidos(resultado)
            res.render('pedidos-deletados', { pedidos: pedidosagrupados })
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro);
            res.status(500).send('Erro ao carregar pedidos.');
        }
    },

    //rota reativar pedidos
    pedidosReativar: (req, res) => {
        const codigo = req.params.pedido_id
        const sql = `UPDATE pedidos SET deletado = FALSE WHERE id = ?`
        conexao.query(sql, [codigo], (err, retorno) => {
            if (err) {
                console.error('Pedido não atualizado', err)
                res.status(500).send('Pedido não atualizado')
            }
            req.flash('success_msg', `Pedido  #${codigo} Reativado!`)
            res.redirect('/pedidos-deletados')
        })
    },

    //Imprimir pedido
    imprimir: async (req, res) => {
        const pedidoId = req.params.pedido_id;

        const dadosPedido = await buscaPedidoPorFiltro(`WHERE p.id = ${pedidoId}`)
        const dadosAgrupados = agruparPedidos(dadosPedido)

        res.render('impressao', {
            pedidos: dadosAgrupados,
            ocultar_header: true
        });
    },

    //Rota para concluir pedido
    pedidoConcluir: (req, res) => {
        const id = req.params.pedido_id
        const sql = `UPDATE pedidos SET concluido = TRUE , foi_pago = TRUE WHERE  id = ?`
        conexao.query(sql, [id], function (erro, retorno) {
            if (erro) {
                console.error('Pedido não concluido erro:', erro)
                res.status(500).send('Pedido não concluido! Erro Servidor')
            }
            req.flash('success_msg', `Pedido #${id}  Concluido!`)
            res.redirect('/pedidos')
        })
    },
    //Rota para Exibir pedidos finalizados
    pedidosFinalizados: async (req, res) => {
        try {
            const resultado = await buscaPedidoPorFiltro('WHERE p.concluido = TRUE')
            const pedidosagrupados = agruparPedidos(resultado)
            res.render('pedidos-finalizados', { pedidos: pedidosagrupados })
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro);
            res.status(500).send('Erro ao carregar pedidos.');
        }
    },

    //Voltar pedido
    pedidosVoltar: (req, res) => {
        const id = req.params.pedido_id
        const sql = 'UPDATE pedidos SET concluido = FALSE WHERE id = ?'
        conexao.query(sql, [id], function (erro, retorno) {
            if (erro) {
                console.error('Erro ao voltar o pedidos', erro)
                res.status(500).send('erro ao Voltar pedido')
            }
            req.flash('success_msg', `Pedido #${id} voltou para pendente.`)
            res.redirect('/pedidos-finalizados')
        })
    },

    pedidoEditar: async (req, res) => {
        const id = req.params.pedido_id;
        const sql = 'SELECT * FROM produtos WHERE quantidade > 0 AND ativo = TRUE '

        function buscarProdutos(sql){
            return new Promise((resolve, reject)=>{
                conexao.query(sql, function(err, retorno){
                    if(err){
                        console.error('Erro ao buscar produtos:', err);
                        return reject(err)
                    }
                    resolve(retorno)
                })
            })
        }
        try {
            const produtos = await buscarProdutos(sql)
            const resultado = await buscaPedidoPorFiltro(`WHERE p.id = ${id}`);
            const pedidosAgrupados = agruparPedidos(resultado);

            if (pedidosAgrupados.length === 0) {
                return res.status(404).send({ erro: "Pedido não encontrado!" });
            }

            // Retorna o pedido agrupado como JSON
            res.render('editaPedido',{
                pedido:pedidosAgrupados[0], 
                produtos:produtos
            })

        } catch (erro) {
            console.error('Erro ao exibir pedido', erro);
            res.status(500).send({ erro: erro.message || 'Erro interno no servidor' });
        }
    }

}
