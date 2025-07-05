const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoControler');
// Rota principal
router.get('/', produtoController.exibirFormulario);
router.get('/estoquedia', produtoController.ativos);
router.post('/cadastrar', produtoController.cadastrar);
router.get('/remover/:codigo', produtoController.remover);
router.get('/editar/:codigo/:imagem', produtoController.editar);
router.get('/produtos-inativos', produtoController.inativos);
router.get('/reativar-produto/:codigo', produtoController.reativar);
router.post('/alterar', produtoController.alterar);
router.get('/cancelar', produtoController.cancelar);


module.exports = router