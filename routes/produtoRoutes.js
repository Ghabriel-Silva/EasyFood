const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produto.controller')

//Rota para o fomulario iniciar de cadastro
router.get('/', produtoController.formulario)

//Rota para cadastrar produto no banco de dados
router.post('/cadastrar', produtoController.cadastrar)

//Rota para exibir a lista de produtos
router.get('/estoquedia', produtoController.listarAtivos)

//Rota para remover porduto da lista inativa o Produto
router.get('/remover/:codigo', produtoController.inativar) 



module.exports = router;