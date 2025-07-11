const conexao = require('../config/dataBase')
const path = require('path');
const fs = require('fs');
const { agruparPedidos, buscaPedidoPorFiltro, gerarNumeroPedidoDoDia, pegaNumeroDoPedido } = require('../helpers/pedidosHelpers')
const Estatisticas = require('../models/estaticasModel')


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
                const produtoAtual = resultados.find(p => p.codigo == codigoProduto) //Retorna primeiro objeto dentro do array resultados que 
                // tenha p.codigo igual ao valor de codigoProduto.

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

            //Geral numero do pedido Id
            const dataHoje = new Date().toISOString().slice(0, 10)
            const numeroPedido = await gerarNumeroPedidoDoDia(dataHoje)

            const pedidoId = await new Promise((resolve, reject) => {
                const sql = `INSERT  INTO pedidos(nome_cliente, endereco, valor_total, forma_pagamento, foi_pago, observacao, entrega, numero_pedido_dia ) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
                const valores = [cliente, endereco, valor_total, forma_pagamento, pago, observacao, entrega, numeroPedido]
                console.log('Valores do pedido a inserir:', valores);

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
        const numeroPedido = `SELECT numero_pedido_dia FROM pedidos WHERE id = ?`
        const deletarQuery = `UPDATE pedidos SET deletado = TRUE WHERE id = ?`


        conexao.query(numeroPedido, [codigo], function (erro1, retorno1) {
            if (erro1) {
                console.log('erro ao atualizar produto', erro1)
                return res.status(500).send('Erro ao deletar Pedido')
            }
            const numeroPedidoDia = retorno1[0]?.numero_pedido_dia //pegue o valor de numero_pedido_dia do primeiro resultado,mas só se ele existir — senão, 
            // fique como undefined.

            conexao.query(deletarQuery, [codigo], (erro2) => {
                if (erro2) {
                    console.error('Erro ao deletar pedido:', erro2);
                    return res.status(500).send('Erro ao deletar pedido');
                }

                req.flash('success_msg', `Pedido #${numeroPedidoDia || codigo} removido com sucesso`);
                res.redirect('/pedidos');
            });
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
    pedidosReativar: async (req, res) => {
        try {
            const codigo = req.params.pedido_id
            const numero = await pegaNumeroDoPedido(codigo)

            const sql = `UPDATE pedidos SET deletado = FALSE WHERE id = ?`
            conexao.query(sql, [codigo], (err, retorno) => {
                if (err) {
                    console.error('Pedido não atualizado', err)
                    res.status(500).send('Pedido não atualizado')
                }

                req.flash('success_msg', `Pedido  #${numero} Reativado!`)
                return res.redirect('/pedidos-deletados')
            })
        } catch (erro) {
            console.log(erro)
            return res.status(500).send('Pedido não reativado')
        }
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
    pedidoConcluir: async (req, res) => {
        try {
            const id = req.params.pedido_id
            const sql = `UPDATE pedidos SET concluido = TRUE , foi_pago = TRUE WHERE  id = ?`
            const numero = await pegaNumeroDoPedido(id)
            conexao.query(sql, [id], function (erro, retorno) {
                if (erro) {
                    console.error('Pedido não concluido erro:', erro)
                    return res.status(500).send('Pedido não concluido! Erro Servidor')
                }
                req.flash('success_msg', `Pedido #${numero}  Concluido!`)
                return res.redirect('/pedidos')
            })
        } catch (erro) {
            console.log('erro ao concluir pedido', erro)
            return res.status(500).send('Erro interno ao processar a conclução do pedido')
        }
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
    pedidosVoltar: async (req, res) => {
        try {
            const id = req.params.pedido_id
            const sql = 'UPDATE pedidos SET concluido = FALSE WHERE id = ?'
            const numero = await pegaNumeroDoPedido(id)
            conexao.query(sql, [id], function (erro, retorno) {
                if (erro) {
                    console.error('Erro ao voltar o pedidos', erro)
                    return res.status(500).send('erro ao Voltar pedido')
                }
                req.flash('success_msg', `Pedido #${numero} voltou para pendente.`)
                return res.redirect('/pedidos-finalizados')
            })

        } catch (erro) {
            console.log('Erro ao Voltar Pedido')
            return res.status(500).send('Erro interno ao voltar pedido')
        }
    },
    buscaDados: async (req, res) => {
        try {
            const mes = parseInt(req.body.mes)
            const ano = parseInt(req.body.ano)

            const [mediaVendaMensal, mediaVendasSemana, mediaValorMensal, totalPedidoConcluido, produtosMaisVendidos, formaPagamentoMaisUsada, pedidosCanceladosExcluidos] = await Promise.all([
                Estatisticas.vendasMensais(mes, ano),
                Estatisticas.mediaPedidosPorSemana(mes, ano),
                Estatisticas.mediaValorDoPedidosMensal(mes, ano),
                Estatisticas.totalPedidosConcluídos(mes, ano),
                Estatisticas.produtosMaisVendido(mes, ano),
                Estatisticas.formaPagamentoMaisUsada(mes, ano),
                Estatisticas.pedidosCanceladosExcluidos(mes, ano)
            ])

            //calcular mês anterior
            let mesAnterior = mes - 1
            let anoAnterior = ano

            if (mesAnterior === 0) {
                mesAnterior = 12
                anoAnterior = ano - 1
            }
            const [
                vendasMesAnterior,
                valorMesAnterior
            ] = await Promise.all([
                Estatisticas.vendasMensais(mesAnterior, anoAnterior),
                Estatisticas.mediaValorDoPedidosMensal(mesAnterior, anoAnterior),

            ])

            res.json({
                mediaVendaMensal,
                mediaVendasSemana,
                mediaValorMensal,
                totalPedidoConcluido,
                produtosMaisVendidos,
                formaPagamentoMaisUsada,
                pedidosCanceladosExcluidos, 
                comparativo:{
                    vendasMesAnterior,
                    valorMesAnterior
                }
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Erro ao buscar dados' })
        }
    },

    relatorios: async (req, res) => {

        return res.render('relatorios', {
        })
    }
}
