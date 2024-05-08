## Configuração

1. **Instalação de Dependências:**
   Certifique-se de ter o Node.js e o PostgreSQL instalados em sua máquina.

2. **Clonando o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```

3. **Instalando Dependências:**
   Navegue até o diretório do projeto e execute o comando:
   ```bash
   npm install
   ```

4. **Configuração do Banco de Dados:**
   - Certifique-se de ter o PostgreSQL em execução.
   - Crie um banco de dados chamado `atividade_herois`.
   - Verifique se as configurações do banco de dados no arquivo `index.js` estão corretas:
     ```javascript
     const pool = new Pool({
         user: 'seu-usuario',
         host: 'localhost',
         database: 'atividade_herois',
         password: 'sua-senha',
         port: 5432,
     });
     ```

## Executando o Sistema

Após configurar o ambiente, você pode iniciar o servidor com o seguinte comando:

```bash
npm start
```

Isso iniciará o servidor na porta padrão 3000, a menos que você tenha definido uma porta diferente nas variáveis de ambiente.

## Rotas

### Heróis

- **GET /herois:** Retorna todos os heróis cadastrados.
- **GET /herois/:id:** Retorna o herói correspondente ao ID especificado.
- **GET /herois/nome/:nome:** Retorna o herói correspondente ao nome especificado.
- **GET /herois/nivel/:nivel:** Retorna os heróis correspondentes ao nível especificado.
- **POST /herois:** Cria um novo herói.
- **PUT /herois/:id:** Atualiza os dados do herói correspondente ao ID especificado.
- **DELETE /herois/:id:** Remove o herói correspondente ao ID especificado.
- **GET /herois/batalha/:id1/:id2:** Realiza uma batalha entre dois heróis e retorna o vencedor.
- **GET /herois/batalha/:nome:** Retorna as batalhas em que um herói participou, incluindo se ele foi o vencedor.
- **GET /herois/batalhas:** Retorna todas as batalhas realizadas, incluindo os heróis vencedores.

## Contribuição

Se você quiser contribuir com melhorias para este projeto, fique à vontade para enviar pull requests ou abrir issues!

---

Esse README fornece uma visão geral do seu projeto, instruções para configurar e executar, além de detalhes sobre as rotas disponíveis. Lembre-se de adaptar as instruções de acordo com as necessidades específicas do seu projeto e da sua configuração de ambiente.
