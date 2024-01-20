# fp-a_project
Projeto de FP&A com dashboard e tabela para abordagem de conceitos básicos, sobre receita, impostos, despesas e lucro.
O projeto tem como objetivo abordar conceitos básicos de P&L como analista de dados. 
As tecnologias, ferramentas e frameworks utilizados para construção desse projeto foram:
  •	Python (PANDAS)
  •	PostgreSQL
  •	EXCEL
  •	POWERBI
  •	SQL
  •	M
  •	DAX
  •	ETL
  •	MODELAGEM DIMENSIONAL (Star Schema)
  •	ISSUE TREE


As etapas para o desenvolvimento do projeto foram:
1.	Construção da base de dados – Realizada em python a base de dados foi construída com valores aleatórios e algumas regras para que a base fosse o suficiente para começar a construir uma análise.
    a.	O arquivo com o código criado para gerar a base está na pasta: “Códigos” e o nome do arquivo é: “Gerador_dataset_FP_A.ipynb”
    b.	O arquivo CSV gerado pelo código está na pasta: “Datasets” e o nome do arquivo é: “tb_stg_vendas.csv”
2.	Criação da base de dados Staging – a partir dos dados criados pelo python, foi construída uma base de dados em PostgreSQL para armazenar os dados em uma base, abordando o conceito básico de SQL.
    a.	O script SQL para criação da base e importação do dataset em CSV está na pasta “Códigos” e o nome do script é: “script_data_base_vendas.sql”.
3.	ETL – O ETL foi realizado no POWER QUERY. O objetivo dessa construção foi abordar mais o tratamento de dados via PBI. Com isso economizar recursos, uma vez que o projeto suporta esse tipo de abordagem com uma única consulta ao banco de dados.
    a.	Os códigos em M para realizar o ETL no POWER QUERY estão na pasta: “Códigos” o nome do arquivo é: “ETL_PQ_FPA (POWER QUERY)”
4.	Importação de conteúdos adicionais para a modelagem de dados. A planilha de custos vem de um XLXS do Excel e irá compor uma dimensão do modelo relacional.
a.	A planilha está na pasta: “Datasets” o nome é: tb_custos.xlxs
5.	A modelagem dos dados está na pasta: “IMG” no arquivo: “Modelagem_dados.png”
6.	O dashboard está na pasta raiz com o nome: “case_fp_a.pbix”
7.	O link da publicação do dashboard está em: https://x.gd/lv7LQ
