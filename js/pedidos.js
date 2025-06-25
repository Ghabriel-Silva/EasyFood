const produtoSelect = document.getElementById('produto-select')
const quantidadeSelect = document.getElementById('quantidade-select')

produtoSelect.addEventListener('change', function () {
    const selectedOption = produtoSelect.options[produtoSelect.selectedIndex] //Primeiro seleciono a opção

    const quantidadeDisponivel = parseFloat(selectedOption.dataset.quantidade) //seleciono a quandidade da opção que vem do data-quantidade="{{quantidade}}
    const unidade = selectedOption.dataset.unidade //pego a unidade
    //Limpar o select de quantidade
    quantidadeSelect.replaceChildren() // limpa opções antigas


    //Adicionando a primeira opção padrao
    const defaultOption = document.createElement('option')
    defaultOption.value = ""
    defaultOption.textContent = "Selecione a quantidade!"
    quantidadeSelect.appendChild(defaultOption)



    if (!isNaN(quantidadeDisponivel) && quantidadeDisponivel > 0) {
        let passo = 1

        if (unidade === 'kg') {
            passo = 0.1
        } else if (unidade === 'g') {
            passo = 100

        }


        for (let i = passo; i <= quantidadeDisponivel; i += passo) {
            const option = document.createElement('option')

            let valorFormatado;
            let texto;


            if (unidade === 'kg') {
                valorFormatado = i.toFixed(2)
                texto = `${valorFormatado} Kg`
            } else if (unidade === 'g') {
                valorFormatado = i.toFixed(0)
                texto = `${valorFormatado} g`

            } else if (unidade === 'un') {
                valorFormatado = i.toFixed(0)
                texto = `${valorFormatado} un`

            } else {
                valorFormatado = i.toFixed(0)
                texto = `${valorFormatado} Porção`
            }

            option.value = valorFormatado
            option.textContent = texto
            quantidadeSelect.appendChild(option)

        }
    }
})

