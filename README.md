

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




## 👀 Passo 7: Importar o Bootstrap localmente com Express
1️⃣ Instalar o Bootstrap via NPM
```bash
      npm install bootstrap
```
---

2️⃣ Configurar o Bootstrap no app.js 
```js
      // 	Cria uma rota pública para o navegador acessar os arquivos
      // Isso permite que possamos usar os arquivos CSS e JS do Bootstrap dentro das views
      app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

      //Middleware => Função que intercepta requisições e pode alterar, processar ou responder a elas.

      //app.use => Método do Express que registra um middleware para processar requisições.

      ///bootstrap é a “porta de entrada” na URL

      //express.static(...) => Middleware do Express para servir arquivos estáticos (CSS, JS, imagens etc.).
      
      //./node_modules/bootstrap/dist é o “endereço real” no seu projeto
```
---

3️⃣ Usando no Html  a rota publica definida 
 ```js
  / <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css"> 

  // Cria uma rota pública para o navegador acessar os arquivos 
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

## 👀 Passo 9: Estruturando formulario e conceitos do app

1-Estrutura basica no meu formulario para trabalhar com envio de informações
 ```bash
  action="/cadastrar" {{defino a Rota que as info irão}}
  method="POST"  {{Metodo de envio das informações}}
  enctype="multipart/form-data" {{Permite o envio de arquivos binarios como imagems, videos}}
  name="produto" {{Serve para fazer referencia quando enviado no arquivo json}}
 ```
---
2-Manipulação de dados via rotas
```bash
  app.use(express.json())  para ler JSON 
  app.use(express.urlencoded({extended:false})); # para ler dados de formulários com uma estrutura mais simplifida de dados. Essa estrutura irá interpretar os dados apenas como string ou array
```

3-Instalando e configurando o upload expresso de arquivo
 
 ```bash
  # Middleware express simples para upload de arquivos.

  # Com NPM
    npm i express-fileupload

  #Importando módulo fileupload
    const fileupload = required('express-fileupload')
  
  #Habilitando o upload de arquivos no app
    app.use(fileupload())

  #Usando o upload no meu app.post, no caso quando uso files tou chamando o fiilesupload e definindo o name que quero pegar e defino o dado também!
    console.log(req.files.imagem.name) 

 #Enviando uma imagem  para pasta imagem onde:
    req.files.imagem.mv(__dirname+'/image/'+req.files.imagem.name)
#req.files.imagem.name => 	Usa o nome original do arquivo enviado (ex: foto.jpg, arquivo.pdf
    #req.files.imagem: é o arquivo enviado com name="imagem" no formulário.
  #.mv(): move esse arquivo para onde você quiser.
  #caminho: caminho absoluto ou relativo onde o arquivo será salvo.
  #callback: função que trata erro ou sucesso.
    req.files.imagem.mv(caminho, callback);
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





