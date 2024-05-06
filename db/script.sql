database name : atividade_herois

CREATE TABLE herois (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    poder VARCHAR(255) NOT NULL,
    nivel INT NOT NULL,
    vida INT NOT NULL
);

insert teste
INSERT INTO herois (nome, poder, nivel, vida) VALUES ('Homem de Ferro', 'Armadura', 10, 100);

CREATE TABLE batalhas (
    id SERIAL PRIMARY KEY,
    id_heroi1 INT NOT NULL,
    id_heroi2 INT NOT NULL,
    vencedor INT NOT NULL,
    FOREIGN KEY (id_heroi1) REFERENCES herois(id),
    FOREIGN KEY (id_heroi2) REFERENCES herois(id),
    FOREIGN KEY (vencedor) REFERENCES herois(id)
);

insert teste
INSERT INTO batalhas (id_heroi1, id_heroi2, vencedor) VALUES (1, 1, 1);