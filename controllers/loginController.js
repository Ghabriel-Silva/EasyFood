const conexao = require('../config/dataBase')
const bcrypt = require('bcrypt')

module.exports = {
    login:(req, res)=>{
        const {email, senha} = req.body;

        const sql = 'SELECT * FROM usuarios WHERE email = ?'
        conexao.query(sql, [email], (erro, resultado)=>{
            if(erro) return resultado.send('Erro no servidor')
            if(resultado.length === 0){
                req.flash('error_msg', 'Usuario não encontrado')
                 return res.redirect('/login')
            }
            const usuario = resultado[0]

            bcrypt.compare(senha, usuario.senha, (err, resultado)=>{
                if(resultado){
                    req.session.usuario = usuario
                    return res.redirect('/')
                }else{
                    return res.send('Senha incorreta', err)
                }
            })
        })
    }, 
    logout: (req, res)=>{
        req.session.destroy()
        res.redirect('/login')
    }
}