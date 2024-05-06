const express = require('express');

const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'atividade_herois',
    password: 'ds564',
    port: 5432,
});

// Rota para listar todos os heróis
app.get('/herois', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM herois');
        res.json({
            total: result.rowCount,
            herois: result.rows,
        });
    } catch (error) {
        console.error('Erro ao obter herois:', error);
        res.status(500).send('Erro ao obter herois');
    }
});

// adicionar um novo herói
app.post('/herois', async (req, res) => {
    const { nome, poder, nivel, vida } = req.body;

    // verificar se a vida está entre 1 e 200
    if (vida < 1 || vida > 200) {
        return res.status(400).send('A vida deve estar entre 1 e 200');
    }

    // verificar se o nível está entre 1 e 10
    if (nivel < 1 || nivel > 10) {
        return res.status(400).send('O nível deve estar entre 1 e 10');
    }

    try {
      await pool.query(
            'INSERT INTO herois (nome, poder, nivel, vida) VALUES ($1, $2, $3, $4)',
            [nome, poder, nivel, vida]
        );

        res.status(201).send(`Herói ${nome} adicionado com sucesso 🦸‍♀️🚀`);
    } catch (error) {
        console.error('Erro ao adicionar herói:', error);
        res.status(500).send('Erro ao adicionar herói');
    }
});

//deletar herois
app.delete('/herois/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM herois WHERE id = $1', [id]);

        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        res.send(`Herói ${nome} deletado com sucesso 🦸‍♀️🚀`);
    } catch (error) {
        console.error('Erro ao deletar herói:', error);
        res.status(500).send('Erro ao deletar herói');
    }
});

// editar herois
app.put('/herois/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, poder, nivel, vida } = req.body;

    // verificar se a vida está entre 1 e 200
    if (vida < 1 || vida > 200) {
        return res.status(400).send('A vida deve estar entre 1 e 200');
    }

    // verificar se o nível está entre 1 e 10
    if (nivel < 1 || nivel > 10) {
        return res.status(400).send('O nível deve estar entre 1 e 10');
    }

    try {
        const result = await pool.query(
            'UPDATE herois SET nome = $1, poder = $2, nivel = $3, vida = $4 WHERE id = $5',
            [nome, poder, nivel, vida, id]
        );

        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        res.send(`Herói ${nome} editado com sucesso 🦸‍♀️🚀`);
    } catch (error) {
        console.error('Erro ao editar herói:', error);
        res.status(500).send('Erro ao editar herói');
    }
});

// pegar por nome
app.get('/herois/nome/:nome', async (req, res) => {
    const { nome } = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE nome = $1', [nome]);

        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao obter herói:', error);
        res.status(500).send('Erro ao obter herói');
    }
});

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}🦸‍♀️🚀`);
});
