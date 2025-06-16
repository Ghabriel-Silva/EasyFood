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


