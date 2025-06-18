
## 📦 Passo 12 – Exclusão de Produtos

### 🔗 Link de exclusão no front-end
Para remover um elemento, primeiro tenho que criar uma rota e adicionar nno botão
```html
<a href="/remover/{{codigo}}/{{imagem}}" class="btn btn-danger">Remover</a>
```

Esse botão envia para a rota de remoção os seguintes parâmetros:
- `codigo`: ID do produto.
- `imagem`: nome do arquivo de imagem que está salvo na pasta.

### 📁 Instalando o FilesSystem
#### O que é o fs?
fs é o módulo de sistema de arquivos (filesystem) do Node.js. Ele permite que você leia, escreva, apague, renomeie e manipule arquivos e diretórios no seu sistema operacional diretamente via JavaScript, fs é um módulo nativo do node.

Utilizando 
```Bash
        #fazendo requisição do modulo
        const fs = require('fs')
```

### 🔁 Rota back-end de remoção

```js
/Rota para remover produtos
app.get('/remover/:codigo/:imagem', function (req, res) {
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`

    const caminhoImagem = path.join(__dirname, 'image', req.params.imagem); //📦 path é um módulo nativo do Node.js que serve para trabalhar com caminhos de arquivos e pastas de forma segura e compatível com qualquer sistema operacional (Windows, Linux, Mac).
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro

        //O Fs.unlink faz a remoção de um arquivo pode ser de texto, imagem, pdf, pasta. Eu passo 2 informações o local que esta o arquivo e uma função callBack que é obrigatoria que ira tratar de error
        fs.unlink(caminhoImagem, (erro)=>{
            if (erro) {
                console.log('Falha ao remover a imagem:', erro);
            } else {
                console.log('Imagem removida com sucesso!');
            }
        })
    })

    //Redirecionar
    res.redirect('/')
})
```






---
