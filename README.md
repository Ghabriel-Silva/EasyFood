
# Guia de Instalação e Configuração do Projeto Node.js com Express, MySQL2 e Handlebars

Este README contém anotações pessoais para lembrar os passos necessários na configuração de um projeto básico utilizando Node.js, Express, MySQL2 e Handlebars como template engine.

---

## 📦 Passo 1: Iniciar o projeto com NPM

Primeiro, é necessário iniciar um novo projeto Node.js. Isso criará o arquivo `package.json`, onde serão registradas todas as dependências.

```bash
npm init -y
```

---

## 🚀 Passo 2: Instalar o Express

Em seguida, instalo o módulo **Express**, que é responsável por criar o servidor, rotas e lidar com requisições/respostas.

```bash
npm install express
```

O Express facilita muito o trabalho com o back-end em Node.js, tornando o código mais limpo e organizado.

---

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

---

## 🛢️ Passo 4: Criar o banco de dados

Crio manualmente o banco de dados no MySQL. Isso pode ser feito via terminal, DBeaver, MySQL Workbench ou outro gerenciador.

```sql
CREATE DATABASE nome_do_banco;
```

---

## 🔗 Passo 5: Instalar o MySQL2

Instalo o driver do MySQL para que o Node.js possa se conectar ao banco de dados.

```bash
npm install mysql2
```

```js
//Criando conexao
const conexao = mysql.createConnection({
    host:'localhost',
    user:'root', 
    password:'@Gs189970', 
    database:'projeto'
})

//Teste de coneção 
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conexão conecatado com sucesso')
})

```

Este módulo é necessário tanto para conexões diretas com o MySQL quanto para o uso com ORMs como o Sequelize.

---


## 🔧 Passo 6: Instalar o Handlebars

O Handlebars será usado como motor de visualização (template engine), permitindo criar páginas dinâmicas renderizadas pelo servidor.

```bash
npm install express-handlebars
```

Depois, configuro no `app.js`:

```js
// Importa a função engine do express-handlebars
const { engine } = require('express-handlebars');

// Configura o motor de visualização (template engine) como Handlebars
// Isso permite renderizar arquivos com a extensão .handlebars
app.engine('handlebars', engine()); // Define o motor que será usado para arquivos .handlebars

// Define que o Handlebars será o motor de visualização padrão do projeto
app.set('view engine', 'handlebars'); // Assim, posso usar res.render('arquivo') para renderizar uma view

// Define o caminho da pasta onde ficam os arquivos de visualização
app.set('views', './views'); // Ou seja, vai procurar os .handlebars dentro da pasta "views"

```

Estrutura basica para utilizar o handlebars
```html
├── app.js
└── views
    ├── home.handlebars
    └── layouts
        └── main.handlebars
```
---

## 👀 Passo 7: Estrutura de pastas recomendada

```bash
/project
├── views/           # Arquivos .handlebars (páginas)
├── public/          # Arquivos estáticos (CSS, imagens, JS)
├── models/          # Modelos do Sequelize
├── routes/          # Arquivos de rotas
├── config/          # Conexão com banco de dados
├── index.js         # Arquivo principal
└── package.json
```

---

## ⚙️ Passo 8: Instalar o Nodemon (opcional)

O Nodemon reinicia automaticamente o servidor sempre que o código é alterado. Útil durante o desenvolvimento.

```bash
npm install --save-dev nodemon
```

No `package.json`, adiciono o script:

```json
"scripts": {
  "dev": "nodemon index.js"
}
```

---

## ✅ Resumo

| Ferramenta        | Função                                                   |
|-------------------|----------------------------------------------------------|
| **Express**       | Cria o servidor, rotas, gerencia requisições             |
| **MySQL2**        | Conecta o Node.js ao banco de dados MySQL                |
| **Sequelize**     | ORM para manipular o banco de dados com JavaScript       |
| **Handlebars**    | Template engine para renderizar páginas HTML dinâmicas   |
| **Nodemon**       | Reinicia o servidor automaticamente durante o desenvolvimento |

---

## 🧠 Observações finais

- Sempre verificar se os módulos foram instalados corretamente no `package.json`.
- Lembre-se de configurar a conexão com o banco de dados, seja usando Sequelize ou MySQL puro.
- Crie rotas organizadas e separe as responsabilidades em arquivos e pastas diferentes.
