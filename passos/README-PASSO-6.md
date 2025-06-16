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