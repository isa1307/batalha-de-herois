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


//validar campos

function validarCampos(body) {
    const campos = ['nome', 'poder', 'nivel', 'vida'];
    for (let campo of campos) {
        if (!body[campo]) {
            return campo;
        }
    }
    return null;
}

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

//pegar por id
app.get('/herois/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE id = $1', [id]);

        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao obter herói:', error);
        res.status(500).send('Erro ao obter herói');
    }
});

// adicionar um novo herói
app.post('/herois', async (req, res) => {
    const { nome, poder, nivel, vida } = req.body;

    const campoVazio = validarCampos(req.body);
    if (campoVazio) {
        return res.status(400).send({ mensagem: `Preencha o campo ${campoVazio}` });
    }


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
        
        res.status(201).json({ 
            message: `Herói ${nome} adicionado com sucesso 🦸‍♀️🚀`,
            heroi: { nome, poder, nivel, vida }
        });
    } catch (error) {
        console.error('Erro ao adicionar herói:', error);
        res.status(500).send('Erro ao adicionar herói');
    }
});

//deletar herois
app.delete('/herois/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultHeroi = await pool.query('SELECT * FROM herois WHERE id = $1', [id]);

        if (resultHeroi.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        const nome = resultHeroi.rows[0].nome;

        await pool.query('DELETE FROM batalhas WHERE id_heroi1 = $1 OR id_heroi2 = $1', [id]);

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

    const campoVazio = validarCampos(req.body);
    if (campoVazio) {
        return res.status(400).send({ mensagem: `Preencha o campo ${campoVazio}` });
    }


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

        res.status(201).json({ 
            message: `Herói ${nome} editado com sucesso 🦸‍♀️🚀`,
            heroi: { nome, poder, nivel, vida }
        });
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

        res.json(result.rows);
      
    } catch (error) {
        console.error('Erro ao obter herói:', error);
        res.status(500).send('Erro ao obter herói');
    }
});

// pegar por nivel
app.get('/herois/nivel/:nivel', async (req, res) => {
    const { nivel } = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE nivel = $1', [nivel]);

        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }
        
        res.json({
            total: result.rowCount,
            herois_com_mesmo_nivel: result.rows,
        });

    } catch (error) {
        console.error('Erro ao obter herói:', error);
        res.status(500).send('Erro ao obter herói');
    }
});

// batalha entre herois 
app.get('/herois/batalha/:id1/:id2', async (req, res) => {
    const { id1, id2 } = req.params;

    try {
        const result1 = await pool.query('SELECT * FROM herois WHERE id = $1', [id1]);
        const result2 = await pool.query('SELECT * FROM herois WHERE id = $1', [id2]);

        if (result1.rowCount == 0 || result2.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }

        const heroi1 = result1.rows[0];
        const heroi2 = result2.rows[0];

        const poder1 = heroi1.nivel + heroi1.vida * heroi1.nome.length;
        const poder2 = heroi2.nivel + heroi2.vida * heroi2.nome.length;

        if (poder1 > poder2) {
            res.send({
                messagem: `${heroi1.nome} com pontuaçaõ de ${poder1} venceu a batalha🦸‍♀️🚀, e ${heroi2.nome} foi derrotado com pontuação de ${poder2}`,
                vencedor: heroi1,

            });
            await pool.query(
                'INSERT INTO batalhas (id_heroi1, id_heroi2, vencedor) VALUES ($1, $2, $3)',
                [heroi1.id, heroi2.id, heroi1.id]
            );

        } else if (poder2 > poder1) {

            res.send({
                messagem: `${heroi2.nome} com pontuaçaõ de ${poder2} venceu a batalha🦸‍♀️🚀, e ${heroi1.nome} foi derrotado com pontuação de ${poder1}`,
                vencedor: heroi2,
            });
            await pool.query(
                'INSERT INTO batalhas (id_heroi1, id_heroi2, vencedor) VALUES ($1, $2, $3)',
                [heroi1.id, heroi2.id, heroi2.id]
            );
          
        } else if (poder1 == poder2) {
            res.send(`Empate, ambas pontuações foram ${poder1} 🦸‍♀️🚀`);
            const empate = heroi1.id || heroi2.id ;
            await pool.query(
                'INSERT INTO batalhas (id_heroi1, id_heroi2, vencedor) VALUES ($1, $2, $3)',
                [heroi1.id, heroi2.id, empate]
            );
        }
    } catch (error) {
        console.error('Erro ao batalhar:', error);
        res.status(500).send('Erro ao batalhar');
    }
});

// pesquisar batalha por nome do heroi
app.get('/herois/batalha/:nome', async (req, res) => {
    const { nome } = req.params;

    try {
        const result = await pool.query('SELECT * FROM herois WHERE nome = $1', [nome]);
    
        if (result.rowCount == 0) {
            return res.status(404).send('Herói não encontrado');
        }
    
        const heroi = result.rows[0];
    
        const batalhas = await pool.query('SELECT batalhas.id as numero_batalha, batalhas.id_heroi1 as heroi1, batalhas.id_heroi2 as heroi2, herois.* FROM batalhas INNER JOIN herois ON batalhas.vencedor = herois.id WHERE batalhas.id_heroi1 = $1 OR batalhas.id_heroi2 = $1', [heroi.id]);
     
            
        const batalhasFormatadas = batalhas.rows.map(batalha => {
            return {
                id: batalha.numero_batalha,
                heroi_1: {
                    nome: batalha.nome,
                    nivel: batalha.nivel,
                    vida: batalha.vida,
                    poder: batalha.poder
                },
                heroi_2: {
                    nome: batalha.nome,
                    nivel: batalha.nivel,
                    vida: batalha.vida,
                    poder: batalha.poder
                },
                vencedor: batalha.nome
            };
        });

        res.json({
            total: batalhas.length,
            batalhas: batalhasFormatadas,
            vencedor: heroi
        });
    } catch (error) {
        console.error('Erro ao obter batalhas:', error);
        res.status(500).send('Erro ao obter batalhas');
    }});

   //pegar todas as batalhas 
   app.get('/batalhas', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM batalhas');
        res.json({
            total: rows.length,
            batalhas: rows,
        });
    } catch (error) {
        res.status(500).send('Erro ao obter batalhas');
    }
});

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}🦸‍♀️🚀`);
});
