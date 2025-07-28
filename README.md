# CLAUCIA WEB

Aplicação web para gerenciamento de profissionais de enfermagem para instituições de saúde do sistema CLAUCIA.

## Sobre o Projeto

Esta aplicação web foi desenvolvida para complementar o sistema CLAUCIA, facilitando o gerenciamento de profissionais de enfermagem por instituições de saúde. O sistema permite o cadastro, visualização, edição e exclusão de profissionais, com autenticação segura baseada em JWT para instituições.

## Tecnologias Utilizadas

- **Angular 20**: Framework para desenvolvimento de aplicações web modernas
- **TypeScript**: Linguagem de programação fortemente tipada
- **Angular Material**: Componentes de interface baseados no Material Design
- **RxJS**: Programação reativa para JavaScript
- **SCSS**: Pré-processador CSS para estilização avançada
- **JWT**: Autenticação baseada em tokens

## Pré-requisitos

- Node.js (versão 18+)
- npm ou yarn
- Angular CLI (`npm install -g @angular/cli`)

## Configuração do Ambiente

1. Clone o repositório:

   ```
   git clone <url-do-repositorio>
   cd tcc-web
   ```

2. Instale as dependências:

   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   As configurações de ambiente estão em `src/environments/`:

   - `environment.ts` (desenvolvimento)
   - `environment.prod.ts` (produção)

4. Configure a integração com a API:

   Certifique-se de que a API CLAUCIA esteja rodando em `http://localhost:3000`

## Executando a Aplicação

### Modo de Desenvolvimento

```
npm start
```

### Modo de Produção

```
npm run build
npm run build --prod
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── login/                 # Componente de autenticação
│   │   ├── dashboard/             # Dashboard principal
│   │   └── professional-dialog/   # Formulário de profissionais
│   ├── services/
│   │   ├── auth.service.ts        # Serviço de autenticação
│   │   └── professional.service.ts # Serviço de profissionais
│   ├── guards/
│   │   └── auth.guard.ts          # Proteção de rotas
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Interceptador de tokens JWT
│   ├── models/
│   │   └── api.models.ts          # Interfaces TypeScript
│   ├── app.config.ts              # Configuração da aplicação
│   └── app.routes.ts              # Configuração de rotas
└── styles.scss                    # Estilos globais
```

## Funcionalidades

### Autenticação de Instituições

- Login baseado em nome da instituição e senha
- Armazenamento de token JWT no localStorage
- Validação automática de tokens
- Proteção de rotas com guards de autenticação

### Gerenciamento de Profissionais

- **Visualizar Profissionais**: Tabela com paginação e ordenação
- **Adicionar Profissional**: Formulário modal com validação
- **Editar Profissional**: Edição in-line com detecção de mudanças
- **Excluir Profissional**: Diálogo de confirmação para exclusão segura

### Experiência do Usuário

- **Estados de Carregamento**: Indicadores de progresso
- **Tratamento de Erros**: Mensagens amigáveis de erro
- **Feedback de Sucesso**: Confirmações para ações realizadas
- **Design Responsivo**: Abordagem mobile-first
- **Acessibilidade**: Labels ARIA e navegação por teclado

## Integração com API

A aplicação se integra com a API CLAUCIA rodando em `http://localhost:3000`. Certifique-se de que a API backend esteja rodando e siga a especificação swagger.

### Endpoints da API Utilizados

- `POST /auth/login/institution` - Autenticação de instituição
- `GET /professionals` - Listar todos os profissionais
- `POST /professionals` - Criar novo profissional
- `PATCH /professionals/{coren}` - Atualizar profissional
- `DELETE /professionals/{coren}` - Excluir profissional

## Desenvolvimento

### Padrões de Código

- **Guia de Estilo Angular**: Segue os padrões oficiais do Angular
- **TypeScript**: Verificação rigorosa de tipos habilitada
- **Componentes Standalone**: Abordagem sem NgModules
- **Signals**: Padrões de reatividade modernos do Angular
- **Formulários Reativos**: Validação de formulários

### Build

```bash
# Build de desenvolvimento
npm run build

# Build de produção
npm run build --prod
```

## Configuração

### Variáveis de Ambiente

A aplicação utiliza as seguintes configurações:

- **API_URL**: URL da API backend (padrão: `http://localhost:3000`)
- **TOKEN_KEY**: Chave do localStorage para token JWT
- **INSTITUTION_KEY**: Chave do localStorage para dados da instituição

### Tema Material

A aplicação utiliza Angular Material com tema customizado configurado em `src/styles.scss`. Você pode personalizar cores e tipografia modificando a configuração do tema Material.

## Segurança

- Tokens JWT armazenados no localStorage
- Interceptador HTTP adiciona automaticamente headers de autorização
- Guards de rota previnem acesso não autorizado
- Validação de formulários previne entrada maliciosa
- Proteção CSRF através dos mecanismos integrados do Angular

## Suporte a Navegadores

- Chrome (última versão)
- Firefox (última versão)
- Safari (última versão)
- Edge (última versão)

## Comandos Úteis

- Iniciar servidor de desenvolvimento: `npm start`
- Build da aplicação: `npm run build`
- Executar linting: `npm run lint`
- Formatação de código: `npm run format`

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
