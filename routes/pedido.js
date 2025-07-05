const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoControler');

router.get('/registro-pedido', pedidoController.formPedidos)
router.post('/registro-pedido', pedidoController.envioPedido )
router.get('/pedidos', pedidoController.pedidos)
router.get('/deletar-pedido/:pedido_id', pedidoController.deletarPedido)
router.get('/pedidos-deletados', pedidoController.pedidosDeletados)
router.get('/reativar-pedido/:pedido_id', pedidoController.pedidosReativar)
router.get('/imprimir-pedido/:pedido_id', pedidoController.imprimir)
router.get('/pedido-concluido/:pedido_id', pedidoController.pedidoConcluir)
router.get('/pedidos-finalizados', pedidoController. pedidosFinalizados)
router.get('/voltar-pedido/:pedido_id', pedidoController.pedidosVoltar)
router.get('/pedido-editar/:pedido_id', pedidoController.pedidoEditar)

module.exports = router