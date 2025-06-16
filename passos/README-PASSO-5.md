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
