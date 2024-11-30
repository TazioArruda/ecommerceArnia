# Projeto E-commerce

Este é um projeto de API para um sistema de e-commerce desenvolvido com NestJS, utilizando PostgreSQL como banco de dados e TypeORM para integração com o banco. A API possui documentação interativa com Swagger.

## Índice

- [Configuração Inicial](#configuração-inicial)
- [Dependências](#dependências)
- [Configurações de Ambiente](#configurações-de-ambiente)
- [Validação](#validação)
- [Documentação](#documentação)
- [Banco de Dados](#banco-de-dados)
- [TypeORM](#typeorm)
- [Como Executar](#como-executar)

## Configuração Inicial

O projeto foi iniciado com NestJS, utilizando o comando:
nest new ecommerceArnia

# Configuração do banco de dados:

Foi utilizada uma conexão com o PostgreSQL, configurada com o TypeORM para gerenciar as tabelas e entidades.
Dependências instaladas:
bash

npm install @nestjs/typeorm typeorm pg

# Documentação com Swagger:

A documentação da API foi implementada com Swagger, permitindo uma interface interativa para testar e explorar as rotas.
Dependências instaladas:
bash
npm install @nestjs/swagger

# Criação das entidades principais:

User: responsável por gerenciar os dados e autenticação dos usuários.
Products: responsável pelo gerenciamento de produtos no sistema.
Jewels: uma entidade específica para joias, um tipo de produto especializado no e-commerce.


Aqui está a seção Estrutura do Projeto atualizada no README com os campos principais de cada entidade:

## Estrutura do Projeto
# Entidades
User
Gerencia os usuários e suas credenciais de autenticação.

Campos principais:

uniqueId (UUID): Identificador único do usuário.
name (string): Nome do usuário.
email (string): Email único do usuário.
password (string): Senha do usuário (armazenada de forma segura).
role (enum): Papel do usuário no sistema (ex.: admin, user).
isActive (boolean): Indica se o usuário está ativo.

Products
Gerencia os produtos disponíveis no e-commerce.

Campos principais:

uniqueId (UUID): Identificador único do produto.
name (string): Nome do produto.
price (float): Preço do produto.
category (enum): Categoria do produto (ex.: electronics, clothing, perishable).
available (boolean): Indica se o produto está disponível.

Jewels
Gerencia informações específicas sobre joias, um tipo especializado de produto.

Campos principais:

uniqueId (UUID): Identificador único da joia.
name (string): Nome da joia.
quantity (int): Quantidade disponível.
isAvailable (boolean): Indica se a joia está disponível.
type (string): Tipo de material da joia.

## Diagrama de Relacionamento

[![Diagrama de Relacionamento do Banco de Dados](https://raw.githubusercontent.com/TazioArruda/ecommerceArnia/64a41b9e9c055acf0a4e4baa9b69e97794729f86/Diagrama%20sem%20nome.drawio%20(3).png)
