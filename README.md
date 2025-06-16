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
