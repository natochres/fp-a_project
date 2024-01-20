/* CRIANDO A TABELA DE ACORDO COM OS DADOS DO CSV */
CREATE TABLE stg_vendas (
    cod_venda SERIAL PRIMARY KEY,
    data_venda DATE,
    nm_produto VARCHAR(50),
    dsc_produto VARCHAR(100),
    vlr_produto NUMERIC(10, 2),
    qtde_vendida INT,
    cod_cliente INT,
    nm_cliente VARCHAR(100),
    last_cliente VARCHAR(100),
    cpf_cliente VARCHAR(11),
    idade_cliente INT,
    email_cliente VARCHAR(100)
);

/* COPIANDO OS DADOS DO CSV PARA A TABELA */

COPY stg_vendas FROM 'C:/Datasets/stg_dre/tb_stg_vendas.csv' DELIMITER ';' CSV HEADER;

SELECT * FROM stg_vendas
LIMIT 10;