const container = document.getElementById('container')
const botaoAdicionar = document.getElementById('adicionar-produto');
const grupoOriginal = container.querySelector('.grupo-produto');
const valor = document.getElementById('valor_total')
const entrega = document.querySelector('.entrega')






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

function calcularValorTotal() {
    const grupos = container.querySelectorAll('.grupo-produto')
    let total = 0

    grupos.forEach(grupo => {
        const selectProduto = grupo.querySelector('.produto-select')
        const selectQuantidade = grupo.querySelector('.quantidade-select')

        const optionSelecionada = selectProduto.options[selectProduto.selectedIndex]
        const preco = parseFloat(optionSelecionada?.dataset.valor) //pega o preço do produto..... ?pega o valor apenas se a opção existir
        const quantidade = parseFloat(selectQuantidade.value) // pega a quantidade selecionad


        if (!isNaN(preco) && !isNaN(quantidade)) {
            total += preco * quantidade
        }
        const totalComFrete = calculaFrete(total)
        valor.value = totalComFrete.toFixed(2)

    })

}
//calcula frete
function calculaFrete(valor) {
    const entregaSelecionada = document.querySelector('input[name="entrega"]:checked'); //Seleciona o input do tipo radio com o name="entrega" que está marcado no momento.

    if (entregaSelecionada && entregaSelecionada.value === "1") {
        valor += 6;
    }

    return valor;

}

container.addEventListener('change', verificaUltimoGrupoPreenchido, calcularValorTotal) //Vai verificar se tenho mudança 



botaoAdicionar.addEventListener('click', function () {
    const clone = grupoOriginal.cloneNode(true)
    const produtoSelect = clone.querySelector('.produto-select')
    const quantidadeSelect = clone.querySelector('.quantidade-select')
    const buttonDelete = document.createElement('button')
    buttonDelete.innerText = 'Deletar'
    buttonDelete.classList.add('btn', 'btn-outline-danger', 'btn-sm', 'mx-3' ,'mb-3')
    buttonDelete.style.display = 'inline-block'
    buttonDelete.style.width = 'auto'

    buttonDelete.addEventListener('click', function () {
        clone.remove()
        buttonDelete.remove()
        botaoAdicionar.disabled = false
        calcularValorTotal()
    })



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
    clone.appendChild(buttonDelete)
    botaoAdicionar.disabled = true   // desabilita até o novo grupo ser preenchido



})


container.addEventListener('change', (e) => {
    if (e.target.classList.contains('produto-select')) {
        const selectProduto = e.target
        const grupo = selectProduto.closest('.grupo-produto') // retorno o ancestral mas proximo com a classe
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
    calcularValorTotal()
})

const radiosEntregas = document.querySelectorAll('input[name="entrega"] ')
radiosEntregas.forEach(radio => {
    radio.addEventListener('change', calcularValorTotal)
})

