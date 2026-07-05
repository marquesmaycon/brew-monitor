# Brew Monitor

Aplicação web para registrar e acompanhar dados de fermentação cervejeira. O sistema permite cadastrar cervejas, tanques, parâmetros aceitáveis de fermentação, registros fermentativos, indicadores de dashboard e histórico por lote.

## Tecnologias

- Backend: C# / .NET 10, ASP.NET Core, Entity Framework Core
- Banco de dados: PostgreSQL 16
- Frontend: React 19, TypeScript, Vite, TanStack Router, TanStack Query, TanStack Form, Tailwind CSS, shadcn/ui
- Infra local: Docker com Docker Compose

## Requisitos e instruções de como executar

### Requisitos

- .NET SDK 10
- Node.js 20.19 ou superior. Também são suportadas as linhas 22.12+ e 24+
- npm
- Docker com suporte ao comando `docker compose`

### 1. Instalar as dependências

Na raiz do repositório:

```bash
npm run api:restore
npm run web:install
```

### 2. Configurar o frontend

Crie o arquivo `web/.env` a partir do exemplo:

```bash
cp web/.env.example web/.env
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item web/.env.example web/.env
```

O valor esperado para desenvolvimento local é:

```env
VITE_API_URL=http://localhost:5027
```

### 3. Subir o banco de dados

```bash
npm run db:up
```

O PostgreSQL será iniciado com:

- Host: `localhost`
- Porta: `5432`
- Database: `brewmonitor`
- Usuário: `brewmonitor`
- Senha: `brewmonitor123`

### 4. Executar a API

```bash
npm run api:dev
```

Ao iniciar, a API aplica as migrations automaticamente e executa o seed inicial. Por isso, não é necessário rodar `npm run api:migrate` no fluxo normal, desde que o PostgreSQL já esteja ativo.

### 5. Executar o frontend

Em outro terminal:

```bash
npm run web:dev
```

Acesse:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5027`
- OpenAPI em desenvolvimento: `http://localhost:5027/openapi/v1.json`

### Comando opcional de migration

O comando abaixo fica disponível para cenários de manutenção, validação isolada do banco ou troubleshooting:

```bash
npm run api:migrate
```

Para usá-lo, instale antes a CLI do EF Core, caso ainda não tenha:

```bash
dotnet tool install --global dotnet-ef
```

### Execução rápida no Windows

Também existe um script para subir banco, API e frontend juntos:

```bash
npm run dev
```

Esse comando executa `docker compose up`, `dotnet run` e `npm --prefix web run dev`. Ele não instala dependências, não cria o arquivo `web/.env` e depende dos passos 1 e 2 já terem sido feitos.

### Scripts disponíveis

```bash
npm run db:up        # inicia o PostgreSQL via Docker Compose
npm run db:down      # derruba o PostgreSQL e os recursos do compose
npm run api:restore  # restaura dependências do backend
npm run api:migrate  # aplica migrations manualmente com EF Core CLI
npm run api:dev      # executa a API em http://localhost:5027
npm run web:install  # instala dependências do frontend com npm ci
npm run web:dev      # executa o frontend em http://localhost:3000
npm run dev          # inicia banco, API e frontend; não instala dependências nem cria .env
```

## Como a solução foi modelada

A solução foi separada em dois projetos principais:

- `api`: backend ASP.NET Core responsável por regras de negócio, persistência, endpoints REST, migrations e seed.
- `web`: frontend React + TypeScript responsável pela experiência de uso, formulários, tabelas, dashboard e navegação.

O modelo de dados possui quatro entidades centrais:

- `Beer`: representa a cerveja, com nome e estilo.
- `Tank`: representa o tanque, com nome e capacidade em litros.
- `FermentationParameter`: guarda os intervalos aceitáveis de temperatura, pH e extrato para uma cerveja.
- `FermentationRecord`: representa um apontamento fermentativo de um lote em um tanque, vinculado a uma cerveja.

Relacionamentos principais:

- Uma cerveja possui no máximo um conjunto de parâmetros fermentativos.
- Um registro fermentativo pertence a uma cerveja e a um tanque.
- O histórico de lote é consultado pelo campo `BatchNumber`, permitindo agrupar todos os apontamentos do mesmo lote.

A classificação é calculada no backend, dentro do serviço de registros fermentativos. O frontend envia os valores medidos, mas a decisão final de classificação fica centralizada na API para manter consistência entre criação, edição, dashboard e histórico.

## Premissas adotadas

O banco relacional escolhido foi PostgreSQL por ser robusto, amplamente usado e simples de executar localmente com Docker Compose.

As classificações seguem este critério:

- `Dentro do Padrão`: temperatura, pH e extrato estão dentro dos intervalos cadastrados para a cerveja.
- `Atenção`: pelo menos um parâmetro saiu do intervalo ideal, mas todos permanecem dentro da margem de tolerância.
- `Fora do Padrão`: algum parâmetro ultrapassou a tolerância ou a cerveja não possui parâmetros fermentativos cadastrados.

Margens de tolerância adotadas:

- Temperatura: 5% abaixo do mínimo ou acima do máximo.
- pH: 0,2 ponto abaixo do mínimo ou acima do máximo.
- Extrato: 5% abaixo do mínimo ou acima do máximo.

Quando qualquer parâmetro fica fora da tolerância, a classificação final passa a ser `Fora do Padrão`. Se vários parâmetros estiverem apenas em tolerância, a classificação permanece `Atenção`.

O histórico por lote foi implementado usando o número do lote como chave de agrupamento. Isso permite visualizar a evolução temporal dos registros sem criar uma entidade separada de lote, mantendo o escopo simples para o desafio.

Os CRUDs foram implementados para cervejas, tanques, parâmetros e registros. Também foram incluídos filtros, paginação e ordenação onde isso melhora a consulta operacional.

## O que faria diferente com mais tempo

- Adicionaria autenticação e autorização por perfil.
- Criaria auditoria de alterações para registros e parâmetros.
- Implementaria exportação de relatórios em CSV/PDF.
- Adicionaria gráficos mais completos de evolução por lote.
- Criaria alertas para registros fora do padrão.
- Ampliaria a cobertura de testes automatizados no backend e no frontend.
- Permitiria configurar as margens de tolerância por cerveja, estilo ou unidade produtiva.
- Melhoraria observabilidade com logs estruturados, métricas e tracing.

## Uso de IA

Foi utilizado o Codex como agente de IA para apoiar debugging, documentação, produtividade e aceleração na geração de código por meio de prompts, sugestões, plan mode e scripts auxiliares.

A IA ajudou principalmente em:

- Investigação de bugs e apoio em debugging.
- Geração inicial de trechos de código e componentes.
- Criação e revisão de scripts de apoio ao desenvolvimento.
- Organização da documentação do projeto.
- Revisão de premissas, fluxos e critérios de classificação.
- Ganho de produtividade em tarefas repetitivas.

O material gerado por IA precisou ser revisado e ajustado em alguns pontos:

- Código fora do padrão desejado em sintaxe, organização, nomes de funções e nomes de componentes.
- Funções auxiliares e subcomponentes gerados inicialmente no mesmo arquivo, depois separados em arquivos próprios para melhorar organização e manutenção.
- Ajustes para alinhar o resultado aos padrões reais do projeto, às portas locais, scripts existentes, regras implementadas e decisões de arquitetura.

## Pontos fortes do app API

- Controllers organizados por domínio, separando endpoints de cervejas, tanques, registros fermentativos, dashboard e lotes.
- Regras de negócio centralizadas em serviços, mantendo os controllers mais focados em entrada, saída e status HTTP.
- Entity Framework Core com PostgreSQL, migrations, seed inicial e convenção `snake_case` no banco de dados.
- Migrations aplicadas automaticamente na inicialização da API, junto com seed inicial para facilitar a execução local.
- Classificação fermentativa calculada no backend, garantindo consistência entre criação, edição, dashboard e histórico.
- Ordenação, paginação e filtragem das listagens processadas server-side, reduzindo carga no navegador, diminuindo o tráfego de dados e melhorando a previsibilidade com bases maiores.
- Regras de consulta centralizadas na API, evitando duplicação de lógica de filtros e ordenação entre telas do frontend.
- Validações de relacionamento, como impedir a remoção de cervejas e tanques com registros associados.
- OpenAPI disponível em ambiente de desenvolvimento e CORS configurado para integração local com o frontend.

## Pontos fortes do app web

- Carregamento inicial de dados pelos `loaders` do TanStack Router, usando `ensureQueryData` para entregar telas já hidratadas com os dados necessários.
- Integração entre TanStack Router e TanStack Query para SSR/hidratação, reduzindo estados de loading desnecessários e reaproveitando cache entre navegações.
- Meta tags centralizadas e dinâmicas por rota, incluindo título, description, Open Graph e Twitter Card.
- Cache do TanStack Query com `staleTime` configurado, o que evita requisições repetidas, melhora a percepção de velocidade e mantém a UI consistente após mutações.
- TanStack Router com rotas tipadas, file-based routing, preload por intenção e restauração de scroll.
- TanStack Form para formulários tipados, estado previsível, validação integrada e componentes de campo reutilizáveis.
- Validação com Zod no frontend, mantendo schemas declarativos e mensagens de erro consistentes.
- Cliente HTTP com Ky, que simplifica chamadas REST com `prefixUrl`, parsing de JSON, tratamento de erros e composição de requests.
- Integração com paginação, ordenação e filtragem server-side, deixando a interface responsável pela experiência de uso sem duplicar regras de consulta da API.
- Tema claro e escuro com inicialização antecipada no documento para evitar flash visual durante a hidratação.
- Componentização de tabelas, formulários, cards e elementos de layout para manter consistência visual e reduzir repetição.

## Funcionalidades implementadas

- Dashboard com totais de registros por classificação.
- CRUD de cervejas.
- CRUD de tanques.
- Cadastro e edição de parâmetros fermentativos por cerveja.
- Registro, listagem, edição e remoção de apontamentos fermentativos.
- Classificação automática do registro ao criar ou atualizar.
- Histórico de lotes com evolução dos apontamentos.
- Filtros, ordenação e paginação em listagens principais.

## Validações e regras

- Cervejas exigem nome e estilo.
- Tanques exigem nome e capacidade maior que zero.
- Parâmetros mínimos devem ser menores ou iguais aos respectivos máximos.
- Registros exigem cerveja, tanque, lote, data/hora, temperatura, pH e extrato.
- Observações são opcionais.
- Cervejas e tanques com registros associados não podem ser removidos diretamente.
- A classificação é recalculada sempre que um registro é criado ou atualizado.

## Estrutura do repositório

```text
.
+-- api/                 # Backend .NET, controllers, services, models, migrations e seed
+-- web/                 # Frontend React + TypeScript
+-- scripts/             # Scripts auxiliares de desenvolvimento
+-- package.json         # Scripts de orquestração local
+-- README.md
```
