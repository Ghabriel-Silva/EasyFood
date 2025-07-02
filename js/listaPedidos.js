document.querySelectorAll('.btn-ver').forEach(btn => {
    btn.addEventListener('click', function () {
        document.getElementById('modal-titulo').textContent = `Pedido #${this.dataset.pedido_id}`;
        document.getElementById('modal-nome').textContent = this.dataset.nome_cliente;
        document.getElementById('modal-endereco').textContent = this.dataset.endereco;
        document.getElementById('modal-valor').textContent = this.dataset.valor_total;
        document.getElementById('modal-pagamento').textContent = this.dataset.forma_pagamento;
        document.getElementById('modal-observacao').textContent = this.dataset.observacao;
        document.getElementById('modal-data').textContent = this.dataset.data_pedido;
        
        
        //Pego o valor queo banco de dados me retorna e manipulo ele 
        const pago = this.dataset.foi_pago;
        const pagoSpan = document.getElementById('modal-pago')

        if(pago === '1'){
            pagoSpan.textContent = 'Sim'
            pagoSpan.className = 'badge bg-success'
        }else{
            pagoSpan.textContent = 'Pendente'
            pagoSpan.className = 'badge bg-danger'
        }


        //Pego o valor que recebo o banco de dados e manipulo ele para aparecer Entregar retirar
        const entrega = this.dataset.entrega;
        const entregaSpan = document.getElementById('modal-entrega')

        if(entrega === '1'){
            entregaSpan.textContent = 'Entregar'
            entregaSpan.className = 'badge text-bg-success'
            
        }else{
            entregaSpan.textContent = 'Retirar'
            entregaSpan.className = 'badge text-bg-primary'

        }

        //Trabalho com adição dos produtos comprados 
        const container = document.getElementById('modal-itens-container')
        container.innerHTML = ''

        let itens = []
        try {
            itens = JSON.parse(this.dataset.itens) || '[]' //Converto a string em um Array de objetos para pode manipular
        } catch (e) {
            console.error('Erro ao ler itens:', e);
        }

        if (itens.length === 0) {
            container.innerHTML = '<p>Sem itens nesse pedido!</p>'
            return;
        }

        itens.forEach(item => {
            container.innerHTML += `
        <div class="col-12 col-md-6">
        <div class="border rounded p-2 shadow-sm bg-light">
            <p class="mb-1"><strong>Produto:</strong> ${item.nome_produto}</p>
            <p class="mb-1"><strong>Quantidade:</strong> ${item.quantidade}</p>
            <p class="mb-0"><strong>Preço Unitário:</strong> R$ ${item.preco_unitario}</p>
        </div>
        </div>
        `
        })
    });
});

//Pego o add de cada pedido e manipulo ele tanto para mostrar quanto para enviar para rota e no backend executar 
document.querySelectorAll('.btn-delete').forEach(btn=>{
    btn.addEventListener('click', function(){
        const pedido_id = this.dataset.pedido_id
        document.getElementById('modal-delete').textContent = `Excluir pedido  #${pedido_id}`;
        document.getElementById('btn-confirm-delete').href = `/deletar-pedido/${pedido_id}`
    } )
})


