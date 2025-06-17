# 11: Listando Produtos

## Passo 1: Rota principal e consulta no banco

```js
app.get('/', function (req, res) {
    let sql = 'SELECT * FROM produtos' // Seleciona todos os produtos do banco

    conexao.query(sql, function(erro, retorno) {
        // Retorna para o template 'form' um objeto com a lista de produtos
        res.render('form', { produtos: retorno })
    })
})
```

> Esse é o método para executar a consulta no banco.  
> A função `query` roda o comando SQL e chama a função de callback quando a consulta termina.  
> Essa função recebe dois parâmetros:
>
> - **`erro`**: caso ocorra algum problema na consulta (ex: erro de sintaxe, problema de conexão).
> - **`retorno`**: se a consulta funcionar, este conterá os dados retornados pelo banco.

### O que vem dentro de `retorno`?

`retorno` é um **array de objetos**, como:

```js
[
  { id: 1, nome: 'Camiseta', valor: 50, imagem: 'camiseta.jpg' },
  { id: 2, nome: 'Calça', valor: 100, imagem: 'calca.jpg' },
  { id: 3, nome: 'Tênis', valor: 200, imagem: 'tenis.jpg' }
]
```

Cada objeto representa uma **linha da tabela `produtos`**, com as colunas da tabela como **propriedades**.

### Por que `{ produtos: retorno }`?

```js
res.render('form', { produtos: retorno })
```

> Aqui, estamos dizendo ao Handlebars:  
> “Quero que o template `form` tenha acesso a uma variável chamada `produtos`, que recebe esse array”.

No template Handlebars, você acessará essa variável assim:

```handlebars
{{#each produtos}}
  {{nome}} - {{valor}}
{{/each}}
```

---

## Passo 2: Servir imagens estáticas com `express.static`

```js
app.use('/imagem', express.static('./image'))
```

> Este código diz ao Express:  
> “Sirva arquivos da pasta `./image` na URL `/imagem`”.
>
> Exemplo: uma imagem salva como `./image/camiseta.jpg`  
> poderá ser acessada via `http://localhost:3000/imagem/camiseta.jpg`

---

## Passo 3: O template Handlebars mostrando os produtos

```handlebars
{{#each produtos}}
  <div class="card" style="width: 18rem;">
    <img src="/imagem/{{imagem}}" class="card-img-top" alt="{{nome}}">
    <div class="card-body">
      <h5 class="card-title">{{nome}}</h5>
      <p class="card-text">{{valor}} R$</p>
      <a href="#" class="btn btn-warning">Editar</a>
      <a href="#" class="btn btn-danger">Remover</a>
    </div>
  </div>
{{/each}}
```

> `{{#each produtos}}` é um **loop** que percorre cada item (objeto) dentro do array `produtos`.  
> Dentro dele, você acessa diretamente as propriedades de cada produto:  
> `{{imagem}}`, `{{nome}}`, `{{valor}}`.

---

## Observação final

Se você quiser mudar o nome da variável `produtos` para outra (como `lista`, `resultados`, etc.), é só alterar no `res.render` e também no template:

```js
res.render('form', { lista: retorno })
```

```handlebars
{{#each lista}}
  {{nome}} - {{valor}}
{{/each}}
```
