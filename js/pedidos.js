const container = document.getElementById('container')
const botaoAdicionar = document.getElementById('adicionar-produto');
const grupoOriginal = container.querySelector('.grupo-produto');

//fucntion verifica se o ultimo grupo esta preenchido 
function verificaUltimoGrupoPreenchido() {
    const grupos = container.querySelectorAll('.grupo-produto') //Node list uma lista de []
    const ultimo = grupos[grupos.length - 1] //verifica o ultimo grupo adcionado
    const produtoSelect = ultimo.querySelector('.produto-select')
    const quantidadeSelect = ultimo.querySelector('.quantidade-select')

    //verifica se tem os dois valores
    if (produtoSelect.value && quantidadeSelect.value) {
        botaoAdicionar.disabled = false
    } else {
        botaoAdicionar.disabled = true
    }
}
verificaUltimoGrupoPreenchido()
// Verifica sempre que há mudança
container.addEventListener('change', verificaUltimoGrupoPreenchido) //Vai verificar se tenho mudança 


botaoAdicionar.addEventListener('click', function () {
    const clone = grupoOriginal.cloneNode(true)
    const produtoSelect = clone.querySelector('.produto-select')
    const quantidadeSelect = clone.querySelector('.quantidade-select')

    //limpa valores 
    produtoSelect.value = ''
    quantidadeSelect.innerHTML = '<option value="">Selecione</option>'

    //Desabilita produtos já escolhidos
    const selectExistes = container.querySelectorAll('.produto-select')//Aqui você seleciona todos os <select>s de produto que já existem dentro do #container.
    selectExistes.forEach(select => { // faz um loop em cada <select> de produto existente.
        const valor = select.value //Pega o valor atual selecionado nesse <select> (o value da <option> escolhida)
        if (valor) { //Só continua se houver de fato algo selecionado (para ignorar selects em branco
            const optionToDisable = produtoSelect.querySelector(`option[value="${valor}"]`) //seleciono  no clone  a opção onde o valor for igual ao valor pego do primeiro select
            if (optionToDisable) {
                optionToDisable.disabled = true
            }
        }
    })
    container.appendChild(clone)
    botaoAdicionar.disabled = true   // desabilita até o novo grupo ser preenchido


})


container.addEventListener('change', (e) => {
    if (e.target.classList.contains('produto-select')) {
        const selectProduto = e.target
        const grupo = selectProduto.closest('.grupo-produto') // retorno o ancestral mias proximo com a classe
        const quantidadeSelect = grupo.querySelector('.quantidade-select')

        const selectOption = selectProduto.options[selectProduto.selectedIndex] // é uma lista de todas as <option> dentro do <select>.  ....selectProduto.selectedIndex retorna o índice da opção atualmente selecionada.



        const quantidadeDisponivel = parseFloat(selectOption.dataset.quantidade)
        const unidade = selectOption.dataset.unidade;

        //limpar as opções antigas
        quantidadeSelect.replaceChildren()

        //Opção padrao
        const defaultOption = document.createElement('option')
        defaultOption.value = ''
        defaultOption.textContent = 'Selecione quantidade!'
        quantidadeSelect.appendChild(defaultOption)

        if (!isNaN(quantidadeDisponivel) && quantidadeDisponivel > 0) {
            let passo = 1;

            if (unidade === 'kg') {
                passo = 0.1;
            } else if (unidade === 'g') {
                passo = 100;
            }

            for (let i = passo; i <= quantidadeDisponivel; i += passo) {
                const option = document.createElement('option');

                let valorFormatado;
                let texto;

                if (unidade === 'kg') {
                    valorFormatado = i.toFixed(2);
                    texto = `${valorFormatado} Kg`;
                } else if (unidade === 'g') {
                    valorFormatado = i.toFixed(0);
                    texto = `${valorFormatado} g`;
                } else if (unidade === 'un') {
                    valorFormatado = i.toFixed(0);
                    texto = `${valorFormatado} un`;
                } else {
                    valorFormatado = i.toFixed(0);
                    texto = `${valorFormatado} Porção`;
                }

                option.value = valorFormatado;
                option.textContent = texto;
                quantidadeSelect.appendChild(option);
            }
        }

    }
})

