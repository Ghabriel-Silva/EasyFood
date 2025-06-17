
## 📦 Passo 12 – Exclusão de Produtos

### 🔗 Link de exclusão no front-end

```html
<a href="/remover/{{codigo}}/{{imagem}}" class="btn btn-danger">Remover</a>
```

Esse botão envia para a rota de remoção os seguintes parâmetros:
- `codigo`: ID do produto.
- `imagem`: nome do arquivo de imagem que está salvo na pasta.

### 🔁 Rota back-end de remoção

```js
app.get('/remover/:codigo/:imagem', function(req, res){
    const codigo = req.params.codigo;
    const imagem = req.params.imagem;

    console.log(codigo);
    console.log(imagem);

    res.send(`${codigo}, ${imagem}`);
});
```

Essa rota ainda está em fase de testes. Ela captura o código e o nome da imagem via URL e exibe no console para verificação.

---
