document.addEventListener('DOMContentLoaded', ()=>{
    const mesSelect = document.getElementById('mes')
    const mesAtual = new Date().getMonth() + 1
    mesSelect.value = mesAtual
})


document.getElementById('buscar').addEventListener('click', async () => {
    const mes = parseInt(document.getElementById('mes').value)
    const ano = parseInt(document.getElementById('ano').value)

    const res = await fetch('/buscaDados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, ano })
    })
    const {
        mediaVendaMensal,
        mediaVendasSemana,
        mediaValorMensal,
        totalPedidoConcluido,
        produtosMaisVendidos,
        formaPagamentoMaisUsada,
        pedidosCanceladosExcluidos,
        comparativo
    } = await res.json()

    const pedidoConcluidos = parseFloat(totalPedidoConcluido.pedido_mensal_concluido)
    const vendaMensal = parseFloat(mediaVendaMensal.pedido_mensal)
    const pedidosCancelados = parseFloat(pedidosCanceladosExcluidos.cancelados)
    const mediaSemanal = parseFloat(mediaVendasSemana.media_pedido_semana)
    const valorTotal = parseFloat(mediaValorMensal.media_Valor_Do_Pedidos_Mensal ?? 0)
    const ticketMedio = pedidoConcluidos ? (valorTotal / pedidoConcluidos) : 0

    const vendasAnteriores = comparativo.vendasMesAnterior?.pedido_mensal || 0
    const valorAnterior = comparativo.valorMesAnterior?.media_Valor_Do_Pedidos_Mensal || 0

    const formatarCrescimento = (atual, anterior) => {
        if (anterior === 0) {
            if (atual === 0) return "0%"
            return "Sem dados do Mês anterior"
        }
        return ((atual - anterior) / anterior * 100).toFixed(2) + "%"
    }

    const crescimentoVendas = formatarCrescimento(vendaMensal, vendasAnteriores)
    const crescimentoValor = formatarCrescimento(valorTotal, valorAnterior)

    // Montar lista de formas de pagamento
    let listaFormaPagamento = ''
    formaPagamentoMaisUsada.forEach(forma => {
        listaFormaPagamento += `<li class="list-group-item flex-fill">${forma.forma_pagamento}: <strong>${forma.total_pagamento}</strong></li>`
    })

    // Montar lista de produtos mais vendidos em tabela
    let tabelaProdutos = ''
    produtosMaisVendidos.forEach((produto, i) => {
        const receitaEstimada = (produto.total_vendido * (produto.valor_pedido ?? 0)).toFixed(2)
        tabelaProdutos += `
          <tr>
            <td>${i + 1}</td>
            <td>${produto.nome_produto}</td>
            <td>${parseFloat(produto.total_vendido).toFixed(1)} ${produto.unidade || ''}</td>
            <td>R$ ${receitaEstimada}</td>
          </tr>`
    })

   document.getElementById('resultado').innerHTML = `
  <!-- Cards resumo geral -->
  <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 mb-4">
    <div class="col">
      <div class="card shadow-sm rounded-4 h-100 border-0">
        <div class="card-body d-flex align-items-center">
          <div class="me-3">
            <i class="bi bi-bag-fill fs-1 text-primary"></i>
          </div>
          <div>
            <h6 class="text-muted mb-1">Pedidos do Mês</h6>
            <h4 class="fw-bold mb-0">${vendaMensal}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card shadow-sm rounded-4 h-100 border-0">
        <div class="card-body d-flex align-items-center">
          <div class="me-3">
            <i class="bi bi-check2-circle fs-1 text-success"></i>
          </div>
          <div>
            <h6 class="text-muted mb-1">Pedidos Concluídos</h6>
            <h4 class="fw-bold mb-0">${pedidoConcluidos}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card shadow-sm rounded-4 h-100 border-0">
        <div class="card-body d-flex align-items-center">
          <div class="me-3">
            <i class="bi bi-x-circle fs-1 text-danger"></i>
          </div>
          <div>
            <h6 class="text-muted mb-1">Pedidos Cancelados</h6>
            <h4 class="fw-bold mb-0">${pedidosCancelados}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card shadow-sm rounded-4 h-100 border-0">
        <div class="card-body d-flex align-items-center">
          <div class="me-3">
            <i class="bi bi-calendar-week-fill fs-1 text-warning"></i>
          </div>
          <div>
            <h6 class="text-muted mb-1">Média de pedidos/semana</h6>
            <h4 class="fw-bold mb-0">${mediaSemanal.toFixed(2)}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Faturamento mensal, ticket médio e comparativo -->
  <div class="row g-4 mb-4">
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h6 class="text-muted mb-2">💰 Faturamento Mensal</h6>
          <h3 class="fw-bold mb-1 text-info">R$ ${valorTotal.toFixed(2)}</h3>
          <small class="text-muted">Total acumulado no mês</small>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h6 class="text-muted mb-2">🧾 Ticket Médio</h6>
          <h3 class="fw-bold mb-1 text-success">R$ ${ticketMedio.toFixed(2)}</h3>
          <small class="text-muted">Faturamento ÷ Pedidos concluídos</small>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h6 class="text-muted mb-2">📈 Crescimento de Pedidos</h6>
          <h3 class="fw-bold mb-1 text-primary">${crescimentoVendas}</h3>
          <small class="text-muted">Comparado ao mês anterior</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Formas de pagamento -->
  <div class="row g-4 mb-4">
    <div class="col-md-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-3">💳 Pedidos por Forma de Pagamento</h5>
          <ul class="list-group list-group-horizontal-md flex-wrap">
            ${listaFormaPagamento}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Produtos mais vendidos -->
  <div class="card shadow-sm mb-5">
    <div class="card-body">
      <h5 class="card-title mb-4">🏆 Produtos Mais Vendidos</h5>
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Produto</th>
              <th>Quantidade Vendida</th>
              <th>Receita Estimada</th>
            </tr>
          </thead>
          <tbody>
            ${tabelaProdutos}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`

})

