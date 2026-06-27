# Spec - Desafio Tecnico ArBrain 2026

## Fonte

- PDF original: `C:\Users\mayco\Downloads\Desafio Técnico.pdf`
- Titulo: Controle de Fermentacao Cervejeira
- Proposto por: ArBrain 2026
- Figma de referencia: https://www.figma.com/design/X82DlWPeF8IjxxHYK9Ptyu/Padr%C3%B5es-ArBrain---Desafio?node-id=0-1&m=dev&t=CQMztIKcjjcdR4Ha-1

## Contexto

Durante o processo de fermentacao, cervejarias realizam acompanhamento periodico
de parametros como temperatura, pH e extrato. Esses registros ajudam a garantir a
qualidade do produto, a padronizacao dos processos produtivos e o atendimento as
exigencias regulatorias do MAPA.

## Objetivo

Desenvolver uma aplicacao web simplificada para registro e acompanhamento de
dados fermentativos, simulando uma funcionalidade presente em sistemas de gestao
para cervejarias.

O objetivo do teste nao e entregar uma aplicacao pronta para producao. A avaliacao
deve considerar forma de pensar, organizacao do codigo, entendimento de
requisitos e tomada de decisoes.

## Requisitos Tecnicos

- Banco de dados relacional de livre escolha.
- Backend em C#/.NET.
- Front-end em React + TypeScript.
- Codigo bem estruturado, utilizando boas praticas de programacao.
- Codigo com comentarios explicativos.
- Layout padronizado de acordo com o Figma informado na secao Fonte.
- Projeto disponibilizado em um repositorio GitHub com historico de commits.
- README com instrucoes claras para execucao do projeto.

## Funcionalidades

### 1. Cadastro de Cervejas

Permitir cadastrar cervejas com:

- Nome.
- Estilo.

### 2. Cadastro de Tanques

Permitir cadastrar tanques com:

- Nome.
- Capacidade em litros.

### 3. Cadastro de Parametros Aceitaveis

Cada cerveja deve possuir parametros fermentativos aceitaveis:

- Temperatura minima.
- Temperatura maxima.
- pH minimo.
- pH maximo.
- Extrato minimo.
- Extrato maximo.

### 4. Registro de Fermentacao

Permitir registrar apontamentos fermentativos com:

- Data e hora do registro.
- Cerveja.
- Tanque.
- Numero do lote.
- Temperatura.
- pH.
- Extrato.
- Observacoes.

Ao salvar um registro fermentativo, o sistema deve comparar os valores informados
com os parametros definidos para a cerveja correspondente e classificar
automaticamente o registro.

### 5. Dashboard Inicial

Criar uma tela inicial com indicadores simples:

- Total de registros fermentativos.
- Registros dentro do padrao.
- Registros que requerem atencao.
- Registros fora do padrao.

### 6. Historico de Lotes

Ao selecionar um lote, o sistema deve exibir todos os apontamentos fermentativos
realizados para ele, permitindo acompanhar sua evolucao ao longo do tempo.

Exemplo:

```text
Lote IPA001
01/06 - 10 graus C - pH 5,2
02/06 - 10,5 graus C - pH 5,1
```

## Regras de Negocio

### Classificacao automatica do registro

Ao salvar um registro, o sistema deve classifica-lo em uma das categorias:

- Dentro do Padrao.
- Atencao.
- Fora do Padrao.

Os criterios de classificacao podem ser definidos pelo candidato e devem ser
documentados.

### Criterio proposto

Este criterio e uma premissa inicial e pode ser ajustado durante a implementacao.

- Dentro do Padrao: temperatura, pH e extrato estao dentro dos intervalos minimo
  e maximo definidos para a cerveja.
- Atencao: pelo menos um parametro esta fora do intervalo aceitavel, mas dentro
  de uma margem de tolerancia configurada.
- Fora do Padrao: pelo menos um parametro ultrapassa a margem de tolerancia ou
  nao ha parametros aceitaveis cadastrados para a cerveja.

Margens iniciais sugeridas:

- Temperatura: ate 5% abaixo do minimo ou acima do maximo.
- pH: ate 0,2 ponto abaixo do minimo ou acima do maximo.
- Extrato: ate 5% abaixo do minimo ou acima do maximo.

Observacoes:

- Se mais de um parametro estiver em atencao, a classificacao continua sendo
  Atencao, desde que nenhum parametro esteja Fora do Padrao.
- Se qualquer parametro estiver Fora do Padrao, a classificacao final do registro
  deve ser Fora do Padrao.
- A classificacao deve ser recalculada sempre que um registro for criado ou
  atualizado.

## Modelo de Dados Sugerido

### Beer

- Id.
- Name.
- Style.
- CreatedAt.
- UpdatedAt.

### Tank

- Id.
- Name.
- CapacityLiters.
- CreatedAt.
- UpdatedAt.

### FermentationParameter

- Id.
- BeerId.
- MinTemperature.
- MaxTemperature.
- MinPh.
- MaxPh.
- MinExtract.
- MaxExtract.
- CreatedAt.
- UpdatedAt.

### FermentationRecord

- Id.
- RegisteredAt.
- BeerId.
- TankId.
- BatchNumber.
- Temperature.
- Ph.
- Extract.
- Notes.
- Classification.
- CreatedAt.
- UpdatedAt.

## Regras de Validacao Sugeridas

- Nome da cerveja e obrigatorio.
- Estilo da cerveja e obrigatorio.
- Nome do tanque e obrigatorio.
- Capacidade do tanque deve ser maior que zero.
- Cada parametro minimo deve ser menor ou igual ao respectivo parametro maximo.
- Registro de fermentacao deve possuir cerveja, tanque, lote, data/hora,
  temperatura, pH e extrato.
- Observacoes devem ser opcionais.
- Numero do lote deve permitir consulta agrupada no historico.

## Telas Sugeridas

- Dashboard.
- Listagem/cadastro/edicao de cervejas.
- Listagem/cadastro/edicao de tanques.
- Cadastro/edicao de parametros por cerveja.
- Criacao de registro fermentativo.
- Historico de lote.

## Perguntas Que Devem Ser Respondidas Na Entrega

### 1. Como a solucao foi modelada?

Registrar aqui a explicacao final sobre arquitetura, entidades, relacionamentos,
fluxo de classificacao e separacao entre backend e frontend.

### 2. Premissas adotadas

Registrar aqui as decisoes tomadas por conta propria, principalmente:

- Banco relacional escolhido.
- Criterio de classificacao Dentro do Padrao, Atencao e Fora do Padrao.
- Margens de tolerancia.
- Estrategia de historico por lote.
- Escopo escolhido para CRUDs, filtros e edicoes.

### 3. O que faria diferente com mais tempo?

Ideias candidatas:

- Autenticacao e autorizacao.
- Auditoria de alteracoes.
- Exportacao de relatorios.
- Graficos de evolucao por lote.
- Alertas para registros fora do padrao.
- Testes automatizados mais abrangentes.
- Parametrizacao das margens de tolerancia por cerveja ou estilo.
- Melhorias de observabilidade e logs.

### 4. Uso de IA

Caso ferramentas de IA sejam utilizadas, documentar:

- Quais ferramentas foram usadas.
- Em quais partes ajudaram.
- O que precisou ser corrigido ou ajustado no material gerado.

## Entrega

- Enviar o link do repositorio GitHub para: `vagas.arbrain@gmail.com`.
- O repositorio deve conter historico de commits.
- O README deve explicar como executar backend, frontend e banco de dados.

## Checklist De Implementacao

- [ ] Definir banco de dados relacional.
- [ ] Criar estrutura do backend em C#/.NET.
- [ ] Criar estrutura do frontend em React + TypeScript.
- [ ] Implementar cadastro de cervejas.
- [ ] Implementar cadastro de tanques.
- [ ] Implementar parametros aceitaveis por cerveja.
- [ ] Implementar registro de fermentacao.
- [ ] Implementar classificacao automatica.
- [ ] Implementar dashboard inicial.
- [ ] Implementar historico de lotes.
- [ ] Aplicar padrao visual do Figma.
- [ ] Escrever README com instrucoes de execucao.
- [ ] Registrar respostas finais do desafio.
