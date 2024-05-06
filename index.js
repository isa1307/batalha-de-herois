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



// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}🦸‍♀️🚀`);
});
