const conexao = require('../config/db')

const path = require('path');
const fs = require('fs');

//Exibe o formulário inicial
exports.formulario = (req, res) => {
    res.render('form')
}

//Exibe a lista de produtos ativos no estoque
exports.listarAtivos = (req, res) => {
    const sql = 'SELECT * FROM produtos WHERE ativo = TRUE'

    conexao.query(sql, function (erro, retorno) {
        if (erro) {
            console.log('Erro ao buscar no banco de dados')
            req.flash('error_msg', 'Erro ao carregar os produtos do estoque.');
            return res.redirect('/');

        }
        res.render('estoquedia', { produtos: retorno })
    })
}

//Rota de cadastro 
exports.cadastrar = (req, res) => {
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
}

//Rota para remover produto da lista Inativa produto (soft delete)
exports.inativar = (req, res) => {
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
}