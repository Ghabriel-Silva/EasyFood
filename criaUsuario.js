const bcrypt = require('bcrypt');
const conexao = require('./config/dataBase');

const email = ''
const senhaTexto = ''

bcrypt.hash(senhaTexto, 10, (err, hash) => {
    if (err) {
        return console.error('Erro ao criptografar senha:', err);
    }
    conexao.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, hash], (erro) => {
        if (erro) {
            console.error('Erro ao cadastrar usuário:', erro);
        } else {
            console.log('✅ Usuário cadastrado com sucesso!');
        }
        conexao.end(); 
    })
})
