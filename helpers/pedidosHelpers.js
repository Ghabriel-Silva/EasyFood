const conexao = require('../config/dataBase')

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
                    pr.unidade_medida,
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
            preco_unitario: linha.preco_unitario,
            unidade_medida: linha.unidade_medida
        });
    });

    return pedidosAgrupados;
}

module.exports = {
    agruparPedidos, 
    buscaPedidoPorFiltro
}