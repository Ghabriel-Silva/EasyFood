CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(codigo)
);

✅ Como funciona essa conexão?
🔹 FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
Isso significa: cada linha da tabela itens_pedido está ligada a um pedido existente na tabela pedidos.

Exemplo: se pedido_id = 6, ele se conecta ao pedido com id = 6 na tabela pedidos.

🔹 FOREIGN KEY (produto_id) REFERENCES produtos(codigo)
Cada linha da itens_pedido está ligada a um produto existente na tabela produtos.

Exemplo: se produto_id = 94, ele se conecta ao produto com codigo = 94.

🔄 O que acontece com ON DELETE CASCADE?
Se você deletar um pedido da tabela pedidos, automaticamente todos os itens daquele pedido na tabela itens_pedido também serão deletados. Exemplo:

sql
Copiar
Editar
DELETE FROM pedidos WHERE id = 6;
➡️ Isso também deleta todos os itens_pedido com pedido_id = 6, porque você ativou o ON DELETE CASCADE.