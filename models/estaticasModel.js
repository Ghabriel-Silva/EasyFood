const conexao = require('../config/dataBase')

module.exports = {
    //1. Total de pedidos realizados no mês
    vendasMensais: (mes, ano) => {
        const sql = `
        SELECT COUNT(concluido) As pedido_mensal
        FROM pedidos
        WHERE 
            MONTH(data_pedido) = ?
            AND YEAR(data_pedido) = ?   
        `
        return new Promise((resolve, reject) => {
            conexao.query(sql, [mes, ano], (err, resultado) => {
                if (err) reject(err)
                resolve(resultado[0])
            })
        })
    },
    //2. Total de pedidos concluídos (ou entregues) no mês
    totalPedidosConcluídos: (mes, ano) => {
        const sql = `
        SELECT COUNT(concluido) As pedido_mensal_concluido
        FROM pedidos
        WHERE 
            MONTH(data_pedido) = ?
            AND YEAR(data_pedido) = ?  
            AND concluido = 1 
        `
        return new Promise((resolve, reject) => {
            conexao.query(sql, [mes, ano], (err, resultado) => {
                if (err) reject(err)
                resolve(resultado[0])
            })
        })
    },
    //3. Produtos mais vendidos no mês (top 5)
    produtosMaisVendido(mes, ano) {
        const sql = `
                SELECT 
                    pr.nome AS nome_produto,
                        pr.valor AS valor_pedido,
                        pr.unidade_medida AS unidade,
                    SUM(ip.quantidade) AS total_vendido
                FROM pedidos p
                    JOIN itens_pedido ip ON p.id = ip.pedido_id
                    JOIN produtos pr ON pr.codigo = ip.produto_id
                WHERE 
                    MONTH(p.data_pedido) = ? AND 
                    YEAR(p.data_pedido) = ? AND 
                    p.concluido = 1  
                GROUP BY pr.nome , pr.unidade_medida , valor
                LIMIT 5
        `
        return new Promise((resolve, reject) => {
            conexao.query(sql, [mes, ano], (err, resultado) => {
                if (err) return reject(err)
                resolve(resultado)
            })
        })

    },

    //4 Forma de pagamentos mais usadas
    formaPagamentoMaisUsada :(mes, ano)=>{
        const sql = `
            SELECT 
                forma_pagamento, 
                COUNT(forma_pagamento) AS total_pagamento
            FROM pedidos
            WHERE 
                MONTH(data_pedido)= ?
                AND YEAR(data_pedido) = ?
                AND concluido = 1 
            GROUP BY  forma_pagamento
            ORDER BY forma_pagamento DESC 
        `
        return new Promise((resolve, reject)=>{
            conexao.query(sql, [mes, ano], (err, resultado)=>{
                if(err) reject(err)
                resolve(resultado)
            })
        })
    },

    //5 media de pedidos por semana
    mediaPedidosPorSemana: (mes, ano) => {
        const sql = `
            SELECT ROUND(COUNT(*) / COUNT(DISTINCT WEEK(data_pedido,1)), 2) AS media_pedido_semana
            FROM pedidos
            WHERE MONTH(data_pedido) = ? AND YEAR(data_pedido) = ? AND concluido = 1
        `
        return new Promise((resolve, reject) => {
            conexao.query(sql, [mes, ano], (err, resultado) => {
                if (err) reject(err)
                const dados = resultado[0]
                if (!dados || dados.media_pedido_semana == null) {
                    resolve({ media_pedido_semana: 0 })
                } else {
                    resolve(dados)
                }
            })
        })
    },

    //6 media do valor de pedido mensal
    mediaValorDoPedidosMensal(mes, ano) {
        const sql = `
            SELECT SUM(valor_total) AS media_Valor_Do_Pedidos_Mensal
            FROM pedidos
            WHERE  MONTH(data_pedido) = ? AND YEAR(data_pedido) = ? AND  foi_pago = 1 AND concluido = 1 
        `
        return new Promise((resolve, reject) => {
            conexao.query(sql, [mes, ano], (err, resultado) => {
                if (err) reject(err)
                const dados = resultado[0]
                if (!dados || dados.media_Valor_Do_Pedidos_Mensal === null) {
                    resolve({ media_Valor_Do_Pedidos_Mensal: 0 })
                } else {
                    resolve(dados)
                }
            })
        })
    },

    //9 Pedidos cancelados ou devolvidos no mês
    pedidosCanceladosExcluidos(mes, ano){
        const sql = `
            SELECT COUNT(deletado) As cancelados
            FROM pedidos
            WHERE 
                MONTH(data_pedido) = ?
                AND YEAR(data_pedido) = ?
                AND deletado = 1
        `
        return new Promise((resolve, reject)=>{
            conexao.query(sql, [mes, ano], (err, resultado)=>{
                if(err) reject(err)
                resolve(resultado[0])
            })
        })
    }
}