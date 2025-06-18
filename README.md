# 📘 Guia de Instalação e Configuração do Projeto Node.js com Express, MySQL2 e Handlebars

Este README contém anotações pessoais para registrar os passos essenciais na criação e configuração de um projeto básico utilizando **Node.js**, **Express**, **MySQL2** e **Handlebars** como template engine.

---

## 📦 Passo 1: Iniciando o Projeto com NPM

O primeiro passo é iniciar um novo projeto Node.js. Isso irá gerar o arquivo `package.json`, responsável por armazenar todas as dependências e informações do projeto.

```bash
npm init -y
```

Esse comando cria o `package.json` com valores padrão, agilizando o processo inicial de configuração do projeto.


## 🚀 Passo 2: Instalar o Express

Em seguida, instalo o módulo **Express**, que é responsável por criar o servidor, rotas e lidar com requisições/respostas.

```bash
npm install express
```

O Express facilita muito o trabalho com o back-end em Node.js, tornando o código mais limpo e organizado.


## 🧱 Passo 3: Criar o servidor

Após instalar o Express, crio um arquivo chamado `index.js` (ou `app.js`) e configuro o servidor com o básico:

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
```


## 🛢️ Passo 4: Criar o banco de dados

Crio manualmente o banco de dados no MySQL. Isso pode ser feito via terminal, DBeaver, MySQL Workbench ou outro gerenciador:

```sql
CREATE DATABASE nome_do_banco;
```

## 🔗 Passo 5: Instalar o MySQL2

Instalo o driver do MySQL para que o Node.js possa se conectar ao banco de dados.

```bash
npm install mysql2
```

```js
const mysql = require('mysql2');

// Criando conexão
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '@Gs189970', 
    database: 'projeto'
});

// Teste de conexão 
conexao.connect(function(erro) {
    if (erro) throw erro;
    console.log('Conexão estabelecida com sucesso');
});
```

Este módulo é necessário tanto para conexões diretas com o MySQL quanto para o uso com ORMs como o Sequelize.



## 🔧 Passo 6: Instalar o Handlebars

O Handlebars será usado como motor de visualização (template engine), permitindo criar páginas dinâmicas renderizadas pelo servidor.

```bash
npm install express-handlebars
```

Depois, configuro no `app.js`:

```js
const { engine } = require('express-handlebars');

// Configura o motor de visualização como Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
```

📁 Estrutura básica para utilizar o Handlebars:
```
├── app.js
└── views
    ├── home.handlebars
    └── layouts
        └── main.handlebars
```

## 👀 Passo 7: Importar o Bootstrap localmente com Express

### 1️⃣ Instalar o Bootstrap via NPM

```bash
npm install bootstrap
```

---

### 2️⃣ Configurar o Bootstrap no `app.js`

```js
// Cria uma rota pública para servir os arquivos do Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
```

📌 Explicações:
- `app.use()` registra um middleware no Express.
- `express.static()` serve arquivos estáticos como CSS e JS.
- `'/bootstrap'` é o caminho público na URL.
- `'./node_modules/bootstrap/dist'` é o diretório real no projeto.

---

### 3️⃣ Usar no HTML (Handlebars)

```html
<link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
```



## 👀 Passo 7: Importar o Bootstrap localmente com Express

### 1️⃣ Instalar o Bootstrap via NPM

```bash
npm install bootstrap
```

---

### 2️⃣ Configurar o Bootstrap no `app.js`

```js
// Cria uma rota pública para servir os arquivos do Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
```

📌 Explicações:
- `app.use()` registra um middleware no Express.
- `express.static()` serve arquivos estáticos como CSS e JS.
- `'/bootstrap'` é o caminho público na URL.
- `'./node_modules/bootstrap/dist'` é o diretório real no projeto.

---

### 3️⃣ Usar no HTML (Handlebars)

```html
<link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
```

---

## ⚙️ Passo 8: Instalar o Nodemon (opcional)

O Nodemon reinicia automaticamente o servidor sempre que o código é alterado, facilitando o desenvolvimento.

```bash
npm install --save-dev nodemon
```



## 👀 Passo 9: Estruturando Formulário e Conceitos do App

### 1️⃣ Estrutura básica no meu formulário para trabalhar com envio de informações

```html
<form action="/cadastrar" method="POST" enctype="multipart/form-data">
  <input type="text" name="produto">
  <input type="file" name="imagem">
  <button type="submit">Cadastrar</button>
</form>
```

```bash
action="/cadastrar"                # Defino a rota que os dados serão enviados  
method="POST"                      # Método de envio das informações  
enctype="multipart/form-data"      # Permite o envio de arquivos binários como imagens, vídeos  
name="produto"                     # Serve para fazer referência quando enviado no JSON  
```

---

### 2️⃣ Manipulação de dados via rotas

```js
app.use(express.json()); 
// Permite ler JSON no corpo da requisição

app.use(express.urlencoded({ extended: false }));
// Permite ler dados de formulários com estrutura simplificada, interpretando como string ou array
```

---

### 3️⃣ Instalando e configurando o upload expresso de arquivos

```bash
# Middleware express simples para upload de arquivos
npm install express-fileupload
```

```js
// Importando módulo fileupload
const fileupload = require('express-fileupload');

// Habilitando o upload de arquivos no app
app.use(fileupload());
```

---

### 4️⃣ Usando o upload no app.post 

```js
app.post('/cadastrar', (req, res) => {
  console.log(req.files.imagem.name); // Mostra o nome original do arquivo enviado

  // Enviando a imagem para a pasta 'image'
  req.files.imagem.mv(__dirname + '/image/' + req.files.imagem.name);
});
```

```bash
req.files.imagem           => É o arquivo enviado com name="imagem" no formulário  
req.files.imagem.name      => Usa o nome original do arquivo enviado (ex: foto.jpg, arquivo.pdf)  
.mv()                      => Move esse arquivo para onde você quiser  
__dirname + '/image/'...   => Caminho absoluto onde o arquivo será salvo  
callback                   => Função opcional que trata erro ou sucesso  
```
---

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

---


# 11: Listando Produtos

### Passo 1️⃣: Rota principal e consulta no banco

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

### Passo 2️⃣: Servir imagens estáticas com `express.static`

```js
app.use('/imagem', express.static('./image'))
```

> Este código diz ao Express:  
> “Sirva arquivos da pasta `./image` na URL `/imagem`”.
>
> Exemplo: uma imagem salva como `./image/camiseta.jpg`  
> poderá ser acessada via `http://localhost:3000/imagem/camiseta.jpg`

---

### Passo 3️⃣: O template Handlebars mostrando os produtos

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

### Observação final

Se você quiser mudar o nome da variável `produtos` para outra (como `lista`, `resultados`, etc.), é só alterar no `res.render` e também no template:

```js
res.render('form', { lista: retorno })
```

```handlebars
{{#each lista}}
  {{nome}} - {{valor}}
{{/each}}
```
---

## 📦 Passo 12 – Exclusão de Produtos

### 🔗 Link de exclusão no front-end

Para remover um produto, é necessário criar um botão no front-end que direcione para a rota de remoção. O botão envia dois parâmetros via URL: o código (ID) do produto e o nome da imagem correspondente.

```html
<a href="/remover/{{codigo}}/{{imagem}}" class="btn btn-danger">Remover</a>
```

Parâmetros enviados:
- `codigo`: ID do produto a ser removido do banco de dados.
- `imagem`: nome do arquivo da imagem salva na pasta de imagens.

---

### 🧱 Módulo File System (`fs`)

O `fs` é um módulo nativo do Node.js utilizado para manipulação de arquivos e diretórios. Ele permite realizar operações como leitura, escrita, exclusão e renomeação de arquivos diretamente no sistema operacional.

Para utilizá-lo, é necessário importar no início do seu arquivo:

```js
const fs = require('fs');
```

---

### 📁 Módulo Path (`path`)

O `path` também é um módulo nativo do Node.js que auxilia na construção de caminhos de arquivos e diretórios, garantindo compatibilidade com diferentes sistemas operacionais (Windows, Linux, Mac).

Importação recomendada:

```js
const path = require('path');
```

---

### 🔁 Rota de Remoção no Back-End

Abaixo está a rota responsável por excluir um produto do banco de dados e, em seguida, deletar sua imagem associada da pasta local:

```js
app.get('/remover/:codigo/:imagem', function (req, res) {
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
    const caminhoImagem = path.join(__dirname, 'image', req.params.imagem);

    conexao.query(sql, function (erro, retorno) {
        if (erro) throw erro;

        fs.unlink(caminhoImagem, (erro) => {
            if (erro) {
                console.log('Falha ao remover a imagem:', erro);
            } else {
                console.log('Imagem removida com sucesso!');
            }
        });

        res.redirect('/');
    });
});
```

#### Explicação:
1. **Recebe os parâmetros** `codigo` e `imagem` pela URL.
2. **Executa uma query SQL** para remover o produto do banco de dados com base no código.
3. **Monta o caminho absoluto** do arquivo da imagem com `path.join(...)`, garantindo que o caminho esteja correto independentemente do sistema operacional.
4. **Remove a imagem** do sistema de arquivos com `fs.unlink(...)`.
5. **Redireciona** o usuário para a página principal após a operação.

---
## 📦 Passo 13 – Edição de Produtos


