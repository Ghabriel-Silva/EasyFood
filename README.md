 🍖 Sistema de Gestão para Assados e Lanches - Full Stack

Este projeto foi desenvolvido para uma empresa do ramo de assados e lanches com o objetivo de modernizar e automatizar processos que antes eram feitos manualmente com papel e caneta. A solução permite o controle completo de produtos, pedidos e relatórios, oferecendo mais organização e praticidade no dia a dia.

---

## 📌 Objetivo

Criar um sistema prático, funcional e personalizável para pequenas empresas que desejam informatizar o controle de pedidos, produtos e estoque, melhorando a gestão sem a necessidade de soluções caras ou complexas.

> “Otimização prematura é a raiz de todos os males” — Donald Knuth  
Por isso, o sistema é **simples, direto ao ponto e pensado conforme as necessidades reais** do negócio.

---

## 💻 Tecnologias Utilizadas

- **Front-end:** JavaScript, Bootstrap, Handlebars  
- **Back-end:** Node.js, Express.js  
- **Banco de Dados:** MySQL  
- **Outros:** express-session, bcrypt, connect-flash, fileupload  

---

## ⚙️ Funcionalidades Principais

- ✅ Login com autenticação de sessão  
- 📦 Cadastro, edição, exclusão e reativação de produtos  
- 🧾 Criação, conclusão, reativação, exclusão e impressão de pedidos  
- 🗃️ Visualização de produtos e pedidos excluídos  
- 📊 Relatórios dinâmicos com filtro por mês/ano  
- 🔐 Proteção de rotas com autenticação  
- 🧠 Interface pensada para simplicidade e clareza  

---

## 🚀 Sobre as Funcionalidades

Este sistema possui diversas funcionalidades avançadas que são comuns em sistemas maiores, proporcionando uma solução completa para a gestão do negócio de assados e lanches.

Entre os diferenciais estão:

- **Controle dinâmico de estoque:** Ao cadastrar pedidos, o sistema automaticamente exibe os produtos disponíveis conforme o estoque, evitando vendas de itens indisponíveis.  
- **Cálculo automático do valor do pedido:** Conforme os produtos são selecionados, o valor total do pedido é calculado em tempo real, incluindo a possibilidade de adicionar frete com valor definido pelo usuário.  
- **Gestão completa de pedidos:** Inclui criação, exclusão, finalização e reativação, com histórico de pedidos deletados para controle e auditoria.  
- **Controle de produtos ativos e inativos:** Produtos podem ser desativados e reativados, facilitando a organização do estoque sem perda de dados.  
- **Relatórios detalhados:** Filtros dinâmicos que facilitam a análise de vendas e controle financeiro mensal.  
- **Autenticação e segurança:** Acesso controlado por login com sessões seguras, garantindo que somente usuários autorizados possam utilizar o sistema.  

Embora seja um sistema básico em termos de design e funcionalidades extras, ele cobre de forma prática e eficiente todas as necessidades essenciais para quem atualmente usa métodos manuais, como bloco de papel ou comandinhas, para controle do negócio.

O projeto é escalável e pode receber atualizações conforme novas necessidades forem surgindo, tornando-se uma ferramenta valiosa para a digitalização e organização do processo comercial.

---

## 🧱 Estrutura do Projeto

```bash
    📁 config
├── express.js # Configuração do Express e middlewares
├── dataBase.js # Conexão com o MySQL

📁 controllers
├── produtoController.js
├── pedidoController.js
├── loginController.js

📁 css
├── styles.css # Estilização complementar

📁 helpers
├── pedidosHelpers.js # Funções auxiliares usadas nos relatórios e pedidos

📁 image
├── ... # Imagens relacionadas aos produtos

📁 js
├── flash.js # Lógica do front-end para mensagens flash
├── listaPedidos.js # Controle visual da lista de pedidos
├── pedidos.js # Interações do front com os pedidos
├── relatorios.js # Comunicação com a rota de relatórios via fetch

📁 middlewares
├── autenticado.js # Middleware para verificar se o usuário está autenticado

📁 models
├── estaticasModel.js # Todas as queries do sistema (produtos, pedidos, etc.)

📁 routes
├── produto.js # Rotas de produtos
├── pedido.js # Rotas de pedidos
├── login.js # Login e logout

📁 views
├── layouts/ # Layout principal (main.handlebars)
├── partials/ # Componentes reutilizáveis (ex: header, footer)
├── login.handlebars # Tela de login
├── estoque.handlebars # Página de estoque
├── pedidos.handlebars # Página de pedidos
├── relatorios.handlebars# Página de relatórios

📁 public
├── css/ # Estilos públicos
├── js/ # Scripts públicos
├── imagens/ # Imagens acessíveis no front-end
```


---

## 🖼️ Capturas de Tela

### Tela de Login
![Tela de Login](ImageReader/login.png)

### Tela de Pedidos
![Tela de Pedidos](ImageReader/pedidosativos.png)

### Tela de Produtos
![Tela de Produtos](ImageReader/estoque.png)

### Relatórios
![Tela de Relatórios](ImageReader/relatorios.png)

### Pedidos deletados
![Pedidos Deletados](ImageReader/pedidosDeletados.png)

### Produtos inativos
![Produtos Inativos](ImageReader/produtosInativos.png)

### Cadastro de Produtos
![Cadastro de Produtos](ImageReader/cadastroprodutos.png)



# Clone o repositório
git clone https://github.com/Ghabriel-Silva/EasyFood

# Acesse a pasta
cd EasyFood

# Instale as dependências
npm install

# Configure o banco de dados (crie um banco MySQL e ajuste as credenciais)

# Rode o servidor
npm start
