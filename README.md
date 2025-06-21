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
    password: 'suasenhaqui', 
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

O express-fileupload é um middleware do Node.js que permite que o Express receba arquivos enviados por formulários HTML com enctype="multipart/form-data" (como imagens, PDFs, etc.).

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

 #### O que é middleware?
  A palavra middleware vem de "meio" (middle) + "software". No contexto do Express.js, um middleware é uma função que roda entre o pedido (request) e a resposta (response) — ele pode modificar a requisição, a resposta, ou decidir se deve continuar para a próxima função.


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
## 📦 Passo 13 – Criando rota para Edição de produtos

  Nesse caso estamos criando apenas a rota que ira direcionar o usuário para a rota de edição, onde o mesmo tera inputs para edição
 ### adiconando rota de editar nos botão de edição
 ```html
   <a href="/Editar/{{codigo}}/{{imagem}}" class="btn btn-danger">Editar</a>
   <!-- Botao com a rota, quando clicar em editar redireciona para uma rota de edição -->
```
### Criando rota no app

Primeiro crio uma rota depois dentro da rota executo comando de pesquisa para pegar o produtos no caso o retorno da consulta sera atibudio a produtos que poderei usar no handlebars
```js
//Rota para editar produto
    app.get('/editar/:codigo/:imagem', function(req, res){
        let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`
        const caminhoImagem = path.join(__dirname, 'image', req.params.imagem)

        conexao.query(sql, function(erro, retorno){
            if(erro) throw erro
            console.log(retorno)
            res.render('form-editar', {
                produtos: retorno[0] // ← passa o objeto direto, não o array
                // Como só tem 1 item, você pode simplificar e acessar direto o primeiro elemento
            })
        })

    })


```
### Crio um html para rota Editar onde atribui o retonorno a produtos 

```html
  
  <main>
      <div class="container mt-3">
          <div class=" img-edite">
              <img src="/imagem/{{produtos.imagem}}" alt="Imagem do produto" class="img-fluid" style="max-height: 100%;">
          </div>
          <form action="/editar" method="POST" enctype="multipart/form-data"
              class="max-width-custom bg-light p-3 rounded-2">

              <div class="mb-3">
                  <label for="produto" class="form-label">Produto</label>
                  <input type="text" class="form-control" id="produto" name="produto" value="{{produtos.nome}}">
              </div>

              <div class="mb-3">
                  <label for="preco" class="form-label">Valor</label>
                  <input type="number" class="form-control" id="preco" name="valor" value="{{produtos.valor}}">
              </div>

              <div class="mb-3">
                  <input class="form-control" type="file" name="imagem">
              </div>

              <input type="hidden" name="codigo" value="{{produtos.codigo}}">
              <input type="hidden" name="imagemAntiga">

              <button type="submit" class="btn btn-primary">Editar</button>
          </form>
      </div>
  </main>
  <!-- Lembrando que uso bootstrap porém tabém uso estilos no css para comprementar  -->
```

## 🔙 Passo 14: Criando a Rota de Cancelamento
Se o usuário clicar em "Cancelar", queremos apenas redirecioná-lo de volta à página inicial:v

### Botão para cancelar

```html
   <a href="/cancelar" class="btn btn-secondary">Cancelar</a>
```

### Rota para redirecionar e ocorer o cancelamento
```js
    //Rota para cancelar a edição do produtos
  app.get('/cancelar', function(req, res){
      res.redirect('/')
  })


```

## 🔙 Passo 15: Fazendo a edição realmente do produto
Até o momento, criamos apenas a rota e o formulário de edição, onde buscamos os dados existentes para pré-preencher os campos do formulário (input).
Agora, vamos trabalhar com o método POST, pois nosso objetivo é atualizar os dados no banco.
Devemos considerar que o usuário pode querer corrigir apenas um pequeno erro de digitação, ou talvez atualizar somente a imagem do produto. Por isso, nosso sistema de edição precisa ser flexível o suficiente para aceitar alterações parciais — atualizando apenas os campos que forem realmente modificados, sem sobrescrever os demais de forma desnecessária. 


```html
    <!-- Botao submite apenas ira enviar o post com dados atualizados  -->
            <button type="submit" class="btn btn-primary me-2">Alterar</button>
```


```html
    <!--Crio 2 input hidden apenas para enviar o codigo que vem do banco de dados e a imagem que também vem,  no caso o nomeImagem é a imagem Atual-->
          <input type="hidden" name="nomeImagem" value="{{produtos.imagem}}"> >
          <input type="hidden" name="codigo" value="{{produtos.codigo}}">
```
```js
    // Rota para alteração de produtos
app.post('/alterar', function (req, res) {
    const { produto, valor, codigo, nomeImagem } = req.body;

    if (req.files && req.files.imagem) { //  req.files=>	O formulário enviou arquivos no caso do input, o files é um objeto  //req.files.imagem=> O campo de imagem foi preenchido com um arquivo
        const imagem = req.files.imagem //Atribuo a imagem que recebo da requisição 
        const novoNomeImagem = Date.now() + '-' + imagem.name; // evita conflito
         const sql = `UPDATE produtos SET nome=?, valor=?, codigo=?, imagem=? WHERE codigo=?`;

        const valores = [produto, valor, codigo, novoNomeImagem, codigo]

        //Executando a eecução
        conexao.query(sql, valores,  function(erro, retorno){
            if(erro){
                console.error('Erro ao atualizar produtos:', erro)
                return  res.status(500).send('Erro no Banco de Dados.')
            }

            //Caminho antigo da imagem
            const caminhoImagemAntiga = path.join(__dirname, 'image', nomeImagem)

            // Remover a imagem antiga, se existir
            if(fs.existsSync(caminhoImagemAntiga)){
                fs.unlink(caminhoImagemAntiga, (erro)=>{
                    if (erro) {
                        console.log('Erro ao remover imagem antiga:', erro);
                    }
                })
            }

            //Salvar a nova imagem
            imagem.mv(path.join(__dirname, 'image', novoNomeImagem), (err)=>{
                if (err) {
                    console.error('Erro ao salvar nova imagem:', err);
                    return res.status(500).send('Erro ao salvar nova imagem.');
                }
                res.redirect('/');
            })
        })
    }else{
        //Se nao for atualizado
        const sql = `UPDATE produtos SET nome=?, valor=?, codigo=? WHERE codigo=?`;
        const valores = [produto, valor, codigo, codigo]
        conexao.query(sql,valores,  function(erro, retorno){
            if(erro){
                console.log('A imagem não foi atualizada')
            }
            res.redirect('/');
        })
    }

});
```
### 🔐 Proteção contra SQL Injection

SQL Injection é uma técnica maliciosa usada para manipular consultas SQL inserindo comandos diretamente nos campos de entrada (como inputs de formulários). Se os dados do usuário forem inseridos diretamente nas consultas SQL, o sistema pode ser comprometido — revelando, alterando ou até excluindo dados importantes do banco.

Para evitar esse risco, usamos queries parametrizadas com ?, que separam o comando SQL dos dados enviados pelo usuário. Isso garante que os dados sejam tratados como valores comuns e não como parte do código SQL.



## Passo 16: Imprementando mensagem de validações

### Sistema de Mensagens Flash com Express, Handlebars e JavaScript

Este guia mostra como configurar mensagens temporárias (flash messages) para mostrar feedbacks de sucesso ou erro em seu site usando Express, Handlebars e JavaScript.

---

## 1. Instalar Dependências

No terminal, rode:

```bash
npm install express-session connect-flash
```

Essas bibliotecas ajudam a armazenar mensagens entre requisições.

---

## 2. Configuração no app.js

No topo do arquivo, importe as libs:

```js
const session = require('express-session');
const flash = require('connect-flash');
```
> express-session: Essa biblioteca cria sessões para cada usuário que acessa seu site. Uma sessão é uma forma de manter dados temporários relacionados a esse usuário enquanto ele navega entre páginas (por exemplo, dados de login, carrinho de compras, ou mensagens temporárias).

> connect-flash: Essa biblioteca usa as sessões criadas pelo express-session para armazenar mensagens temporárias chamadas de flash messages. Essas mensagens duram apenas até a próxima requisição, ou seja, aparecem em uma página e somem depois.


Configure os middlewares logo após criar o app:

```js
app.use(session({
    secret: '@qualquercoisaaqui', // Chave secreta para proteger a sessão (deve ser algo difícil de adivinhar)
    resave: false, // Não salva a sessão se nada foi modificado, para evitar overhead desnecessário
    saveUninitialized: true  //Salva sessões novas, mesmo que não tenham dados, para garantir compatibilidade
}));
app.use(flash());
```
Você pode salvar e recuperar informações temporárias (como as mensagens flash) com req.session, ou com bibliotecas que dependem disso — como connect-flash.
- **app.use(session({...})):**  Aqui você configura o middleware que vai gerenciar as sessões. O secret é uma chave secreta usada internamente para assinar os cookies da sessão e garantir que ninguém falsifique os dados.
 
- **resave: false:** Evita que a sessão seja salva no servidor se não houve nenhuma modificação, otimizando desempenho.

-**saveUninitialized: true:** Cria e salva uma nova sessão mesmo se ela estiver vazia. Isso ajuda no funcionamento correto das mensagens flash, já que elas dependem da sessão estar ativa.

-**app.use(flash()):**Esse middleware ativa o connect-flash para que você possa criar mensagens temporárias usando req.flash() nas suas rotas.

### O que cada coisa faz:

- **express-session:** cria sessões para cada usuário, permitindo armazenar dados temporários.
- **connect-flash:** usa a sessão para salvar mensagens temporárias entre requisições.
-
---

## 3. Middleware para disponibilizar mensagens nas views

Ainda no `app.js`, após o `app.use(flash())`, coloque:

```js
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
}); //Isso torna as mensagens disponíveis nas suas views (ex: Handlebars).
```

Isso passa as mensagens para o template renderizado.

---

## 4. Mostrar as mensagens no Handlebars

Dentro do seu template (ex: `form.handlebars`), adicione:

```handlebars
{{#if success_msg}}
  <div id="flash-msg" class="alert alert-success">{{success_msg}}</div>
{{/if}}

{{#if error_msg}}
  <div id="flash-msg" class="alert alert-danger">{{error_msg}}</div>
{{/if}}
```

---

## 5. Criar o arquivo JavaScript para esconder a mensagem automaticamente

### a) Crie um arquivo `flash.js` dentro da pasta `js` (pasta pública):

```js
window.addEventListener('DOMContentLoaded', () => {
    const flash = document.getElementById('flash-msg');
    if (flash) {
        setTimeout(() => {
            flash.classList.add('fade-out');
            setTimeout(() => {
                flash.remove(); // Remove do DOM após fade out
            }, 500); // duração da transição
        }, 3000); // tempo que a mensagem fica visível
    }
});
```

### b) No seu CSS, adicione:

```css
.fade-out {
  transition: opacity 0.5s ease;
  opacity: 0;
}
```

### c) No `app.js`, deixe a pasta `js` acessível:

```js
app.use('/js', express.static('./js'));
```

### d) No seu template, inclua o script antes do fechamento do `</body>`:

```html
<script src="/js/flash.js"></script>
```

---

## 6. Exemplo de uso na rota de cadastro

```js
app.post('/cadastrar', function (req, res) {
    const { produto, valor } = req.body;

    // Validação simples dos campos e arquivo
    if (!req.files || !req.files.imagem || !produto || !valor || produto.trim() === '' || valor.trim() === '') {
        req.flash('error_msg', 'Todos campos devem ser preenchidos!'); //Isso guarda temporariamente a mensagem numa sessão.
        return res.redirect('/'); // Mas não mostra nada ainda, porque você redirecionou.
    }

    let imagem = req.files.imagem.name;

    const sql = `INSERT INTO produtos (nome, valor, imagem) VALUES (?, ?, ?)`;
    const valores = [produto, valor, imagem];

    conexao.query(sql, valores, function (erro, retorno) {
        if (erro) {
            req.flash('error_msg', 'Erro no banco de dados!');
            return res.redirect('/');
        }

        req.files.imagem.mv(__dirname + '/image/' + imagem, (err) => {
            if (err) {
                req.flash('error_msg', 'Erro ao salvar imagem.');
                return res.redirect('/');
            }

            req.flash('success_msg', 'Produto cadastrado com sucesso!');
            res.redirect('/');
        });
    });
});
```

---

## Resultado esperado

- Mensagens de sucesso e erro aparecem no topo da página.
- Somem automaticamente após 3 segundos com efeito de fade out.
- Facilidade para reutilizar em outras rotas (editar, remover, etc).

---



app.post('/alterar', function (req, res) {
    const { produto, valor, codigo, nomeImagem } = req.body;

    // Primeiro buscar os dados atuais do produto
    conexao.query('SELECT * FROM produtos WHERE codigo = ?', [codigo], function (erro, resultados) {
        if (erro) {
            console.error('Erro ao buscar produto:', erro);
            req.flash('error_msg', 'Erro no Banco de Dados.');
            return res.redirect('/');
        }

        if (resultados.length === 0) {
            req.flash('error_msg', 'Produto não encontrado.');
            return res.redirect('/');
        }

        const produtoAtual = resultados[0];

        // Verifica se veio uma imagem nova no upload
        const novaImagem = (req.files && req.files.imagem) ? req.files.imagem : null;

        // Verificar se houve alteração em algum campo
        const textoMudou = (produto !== produtoAtual.nome) || (valor != produtoAtual.valor); // valor != para permitir comparar string e number
        const imagemMudou = novaImagem !== null;

        if (!textoMudou && !imagemMudou) {
            // Nenhuma alteração
            req.flash('error_msg', 'Nenhuma alteração detectada.');
            return res.redirect('/');
        }

        if (imagemMudou) {
            // Se mudou a imagem, montar novo nome dela
            const novoNomeImagem = Date.now() + '-' + novaImagem.name;

            const sql = `UPDATE produtos SET nome=?, valor=?, imagem=? WHERE codigo=?`;
            const valores = [produto, valor, novoNomeImagem, codigo];

            conexao.query(sql, valores, function (erro, retorno) {
                if (erro) {
                    console.error('Erro ao atualizar produtos:', erro);
                    req.flash('error_msg', 'Erro ao atualizar produto.');
                    return res.redirect('/');
                }

                // Remover imagem antiga
                const caminhoImagemAntiga = path.join(__dirname, 'image', produtoAtual.imagem);
                if (fs.existsSync(caminhoImagemAntiga)) {
                    fs.unlink(caminhoImagemAntiga, (erro) => {
                        if (erro) console.log('Erro ao remover imagem antiga:', erro);
                    });
                }

                // Salvar nova imagem
                novaImagem.mv(path.join(__dirname, 'image', novoNomeImagem), (err) => {
                    if (err) {
                        console.error('Erro ao salvar nova imagem:', err);
                        req.flash('error_msg', 'Erro ao salvar nova imagem.');
                        return res.redirect('/');
                    }

                    req.flash('success_msg', 'Produto atualizado com sucesso!');
                    return res.redirect('/');
                });
            });
        } else {
            // Se mudou só texto (produto ou valor)
            const sql = `UPDATE produtos SET nome=?, valor=? WHERE codigo=?`;
            const valores = [produto, valor, codigo];

            conexao.query(sql, valores, function (erro, retorno) {
                if (erro) {
                    console.error('Erro ao atualizar produto:', erro);
                    req.flash('error_msg', 'Erro ao atualizar produto.');
                    return res.redirect('/');
                }
                req.flash('success_msg', 'Produto atualizado com sucesso!');
                return res.redirect('/');
            });
        }
    });
});
