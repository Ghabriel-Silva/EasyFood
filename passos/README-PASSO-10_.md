## 📌 Passo 10: Cadastro de Produtos no Banco de Dados e Upload de Imagem

Neste passo, implementamos a **rota de cadastro de produtos**, onde o usuário pode enviar as informações de um novo produto através de um formulário.  
Essas informações serão:

➡️ Armazenadas no banco de dados **MySQL**  
➡️ E a imagem do produto será **salva localmente** na pasta `/image` do projeto

---

### 📥 Rota POST `/cadastrar`

```js
// Rota responsável por cadastrar um novo produto
app.post('/cadastrar', function (req, res) {
    // Obtemos os dados enviados no formulário
    let produto = req.body.produto;           // Nome do produto
    let valor = req.body.valor;               // Valor do produto
    let imagem = req.files.imagem.name;       // Nome do arquivo de imagem enviado

    // Comando SQL para inserir o produto no banco
    let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${produto}', '${valor}', '${imagem}')`;

    // Executa o comando no banco
    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro; // Se der erro, mostra no terminal

        // Move a imagem para a pasta /image
        req.files.imagem.mv(__dirname + '/image/' + imagem);

        // Exibe no console o retorno do banco (opcional)
        console.log(retorno);
    });

    // Após o cadastro, redireciona para a página principal
    res.redirect('/');
});
```

---

### 📌 Explicações importantes

- `req.body` → Objeto que contém os dados enviados no formulário (`input name`)
- `req.body.produto` → Valor do campo com `name="produto"`
- `req.files` → Contém os arquivos enviados pelo formulário (`enctype="multipart/form-data"`)
- `req.files.imagem.name` → Nome original do arquivo de imagem enviado
- `req.files.imagem.mv(destino)` → Move o arquivo enviado para o destino informado
- `__dirname` → Caminho absoluto da raiz do projeto

---

### 📂 Estrutura esperada

```
/projeto
  ├── image/
  │     └── camiseta.jpg
  ├── views/
  ├── app.js
  └── ...
```

> 📝 Certifique-se de que:
> - A pasta `/image` existe na raiz do projeto
> - O formulário HTML está com o `enctype="multipart/form-data"`
> - Você está utilizando o middleware `express-fileupload`
