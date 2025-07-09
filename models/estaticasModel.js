const conexao = require('../config/dataBase')

module.exports = {
    vendasDoDia: ()=>{
        const sql = `
        SELECT MAX(numero_pedido_dia) AS pedidos_hoje
        FROM pedidos
        WHERE DATE(data_pedido) = CURDATE()
        `
        return new Promise((resolve, reject)=>{
            conexao.query(sql, (err, resultado)=>{
                if(err) return reject(err)
                resolve(resultado[0])
            })
        })
    }
}