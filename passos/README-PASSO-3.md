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