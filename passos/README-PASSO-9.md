
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
