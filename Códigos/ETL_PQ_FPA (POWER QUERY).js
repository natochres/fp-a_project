
/* TRATAMENTO DE DADOS DA FATO = FT_FATURAMENTO */
let
    Fonte = PostgreSQL.Database("localhost:5432", "cases"),
    case_fpa_stg_vendas = Fonte{[Schema="case_fpa",Item="stg_vendas"]}[Data],
    #"Coluna Duplicada" = Table.DuplicateColumn(case_fpa_stg_vendas, "nm_produto", "nm_produto - Copiar"),
    #"Colunas Reordenadas" = Table.ReorderColumns(#"Coluna Duplicada",{"cod_venda", "data_venda", "nm_produto - Copiar", "nm_produto", "dsc_produto", "vlr_produto", "qtde_vendida", "cod_cliente", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Valor Substituído" = Table.ReplaceValue(#"Colunas Reordenadas","Mentoria","0004",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído1" = Table.ReplaceValue(#"Valor Substituído","Ebook Data","0001",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído2" = Table.ReplaceValue(#"Valor Substituído1","Ebook Perfil","0002",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído3" = Table.ReplaceValue(#"Valor Substituído2","Curso Analista de dados","0003",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Colunas Renomeadas" = Table.RenameColumns(#"Valor Substituído3",{{"nm_produto - Copiar", "cod_produto"}}),
    #"Colunas Reordenadas1" = Table.ReorderColumns(#"Colunas Renomeadas",{"cod_venda", "data_venda", "cod_produto", "cod_cliente", "qtde_vendida"}),
    #"Coluna Duplicada1" = Table.DuplicateColumn(#"Colunas Reordenadas1", "qtde_vendida", "qtde_vendida - Copiar"),
    #"Colunas Renomeadas1" = Table.RenameColumns(#"Coluna Duplicada1",{{"qtde_vendida - Copiar", "receita_bruta"}}),
    #"Multiplicação Inserida" = Table.AddColumn(#"Colunas Renomeadas1", "Multiplicação", each [receita_bruta] * [qtde_vendida], Int64.Type),
    #"Colunas Removidas1" = Table.RemoveColumns(#"Multiplicação Inserida",{"Multiplicação", "receita_bruta"}),
    #"Multiplicação Inserida1" = Table.AddColumn(#"Colunas Removidas1", "Multiplicação", each [qtde_vendida] * [vlr_produto], type number),
    #"Colunas Reordenadas2" = Table.ReorderColumns(#"Multiplicação Inserida1",{"cod_venda", "data_venda", "cod_produto", "nm_produto", "dsc_produto", "vlr_produto", "cod_cliente", "qtde_vendida", "Multiplicação", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Colunas Renomeadas2" = Table.RenameColumns(#"Colunas Reordenadas2",{{"Multiplicação", "receita_bruta"}}),
    #"Multiplicação Inserida2" = Table.AddColumn(#"Colunas Renomeadas2", "Multiplicação", each [receita_bruta] * 0.05, type number),
    #"Colunas Reordenadas3" = Table.ReorderColumns(#"Multiplicação Inserida2",{"cod_venda", "data_venda", "cod_produto", "nm_produto", "dsc_produto", "vlr_produto", "cod_cliente", "qtde_vendida", "receita_bruta", "Multiplicação", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Colunas Renomeadas3" = Table.RenameColumns(#"Colunas Reordenadas3",{{"Multiplicação", "impostos"}}),
    #"Subtração Inserida" = Table.AddColumn(#"Colunas Renomeadas3", "Subtração", each [receita_bruta] - [impostos], type number),
    #"Colunas Renomeadas4" = Table.RenameColumns(#"Subtração Inserida",{{"Subtração", "receita_liquida"}}),
    #"Colunas Reordenadas4" = Table.ReorderColumns(#"Colunas Renomeadas4",{"cod_venda", "data_venda", "cod_produto", "nm_produto", "dsc_produto", "vlr_produto", "cod_cliente", "qtde_vendida", "receita_bruta", "impostos", "receita_liquida", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Colunas Removidas" = Table.RemoveColumns(#"Colunas Reordenadas4",{"nm_produto", "dsc_produto", "vlr_produto", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Coluna Duplicada2" = Table.DuplicateColumn(#"Colunas Removidas", "data_venda", "data_venda - Copiar"),
    #"Coluna Duplicada3" = Table.DuplicateColumn(#"Coluna Duplicada2", "data_venda - Copiar", "data_venda - Copiar - Copiar"),
    #"Nome do Mês Extraído" = Table.TransformColumns(#"Coluna Duplicada3", {{"data_venda - Copiar", each Date.MonthName(_), type text}}),
    #"Ano Extraído" = Table.TransformColumns(#"Nome do Mês Extraído",{{"data_venda - Copiar - Copiar", Date.Year, Int64.Type}}),
    #"Colunas Mescladas" = Table.CombineColumns(Table.TransformColumnTypes(#"Ano Extraído", {{"data_venda - Copiar - Copiar", type text}}, "pt-BR"),{"data_venda - Copiar", "data_venda - Copiar - Copiar"},Combiner.CombineTextByDelimiter("/", QuoteStyle.None),"cod_custo"),
    #"Colunas Reordenadas5" = Table.ReorderColumns(#"Colunas Mescladas",{"cod_venda", "data_venda", "cod_custo", "cod_produto", "cod_cliente", "qtde_vendida", "receita_bruta", "impostos", "receita_liquida"}),
    #"Colunas Renomeadas5" = Table.RenameColumns(#"Colunas Reordenadas5",{{"qtde_vendida", "Quantidade Vendida"}})
in
    #"Colunas Renomeadas5"
	
	/* CONSTRUÇÃO DA DIMENSÃO DIM_CUSTOS */
	
	let
    Fonte = Excel.Workbook(File.Contents("C:\Cases\fp&a\datasets\tb_custos.xlsx"), null, true),
    Custos_venda_Sheet = Fonte{[Item="Custos_venda",Kind="Sheet"]}[Data],
    #"Cabeçalhos Promovidos" = Table.PromoteHeaders(Custos_venda_Sheet, [PromoteAllScalars=true]),
    #"Tipo Alterado" = Table.TransformColumnTypes(#"Cabeçalhos Promovidos",{{"dsc_custo", type text}, {"tipo_custo", type text}, {"vlr_custo", type number}, {"mês", Int64.Type}, {"ano", Int64.Type}}),
    #"Coluna Duplicada" = Table.DuplicateColumn(#"Tipo Alterado", "ano", "ano - Copiar"),
    #"Colunas Mescladas" = Table.CombineColumns(Table.TransformColumnTypes(#"Coluna Duplicada", {{"mês", type text}, {"ano", type text}}, "pt-BR"),{"mês", "ano"},Combiner.CombineTextByDelimiter("/", QuoteStyle.None),"mes/ano"),
    #"Colunas Removidas" = Table.RemoveColumns(#"Colunas Mescladas",{"ano - Copiar"}),
    #"Tipo Alterado1" = Table.TransformColumnTypes(#"Colunas Removidas",{{"mes/ano", type date}}),
    #"Colunas Renomeadas" = Table.RenameColumns(#"Tipo Alterado1",{{"mes/ano", "data_custo"}}),
    #"Colunas Reordenadas" = Table.ReorderColumns(#"Colunas Renomeadas",{"data_custo", "dsc_custo", "tipo_custo", "vlr_custo"}),
    #"Coluna Duplicada1" = Table.DuplicateColumn(#"Colunas Reordenadas", "vlr_custo", "vlr_custo - Copiar"),
    #"Colunas Removidas1" = Table.RemoveColumns(#"Coluna Duplicada1",{"vlr_custo - Copiar"}),
    #"Coluna Duplicada2" = Table.DuplicateColumn(#"Colunas Removidas1", "data_custo", "data_custo - Copiar"),
    #"Nome do Mês Extraído" = Table.TransformColumns(#"Coluna Duplicada2", {{"data_custo - Copiar", each Date.MonthName(_), type text}}),
    #"Coluna Duplicada3" = Table.DuplicateColumn(#"Nome do Mês Extraído", "data_custo", "data_custo - Copiar.1"),
    #"Ano Extraído" = Table.TransformColumns(#"Coluna Duplicada3",{{"data_custo - Copiar.1", Date.Year, Int64.Type}}),
    #"Colunas Renomeadas1" = Table.RenameColumns(#"Ano Extraído",{{"data_custo - Copiar", "nome_mes"}, {"data_custo - Copiar.1", "ano"}}),
    #"Colunas Mescladas1" = Table.CombineColumns(Table.TransformColumnTypes(#"Colunas Renomeadas1", {{"ano", type text}}, "pt-BR"),{"nome_mes", "ano"},Combiner.CombineTextByDelimiter("/", QuoteStyle.None),"mes_ano"),
    #"Colunas Reordenadas1" = Table.ReorderColumns(#"Colunas Mescladas1",{"data_custo", "mes_ano", "dsc_custo", "tipo_custo", "vlr_custo"}),
    #"Colunas Renomeadas2" = Table.RenameColumns(#"Colunas Reordenadas1",{{"mes_ano", "ref_custo"}})
in
    #"Colunas Renomeadas2"
	
	/* CONSTRUÇÃO DA DIMENSÃO TEMPO */
	
	let

dtInicio = Date.FromText("2019-01-01"),
dtFinal = Date.FromText("2034-12-31"),
anoMinimo = Date.Year(dtInicio),
anoMaximo = Date.Year(dtFinal),
dataComeco = #date(anoMinimo, 01, 01),
dataFinal = #date(anoMaximo, 12, 31),
duracao = Duration.Days (dataFinal - dataComeco),
listaData = List.Dates(dataComeco, duracao, #duration(1,0,0,0)),
    #"Convertido para Tabela" = Table.FromList(listaData, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Colunas Renomeadas" = Table.RenameColumns(#"Convertido para Tabela",{{"Column1", "data_completa"}}),
    #"Tipo Alterado" = Table.TransformColumnTypes(#"Colunas Renomeadas",{{"data_completa", type date}}),
    #"Coluna Duplicada" = Table.DuplicateColumn(#"Tipo Alterado", "data_completa", "data_completa - Copiar"),
    #"Ano Extraído" = Table.TransformColumns(#"Coluna Duplicada",{{"data_completa - Copiar", Date.Year, Int64.Type}}),
    #"Colunas Renomeadas1" = Table.RenameColumns(#"Ano Extraído",{{"data_completa - Copiar", "ano"}}),
    #"Coluna Duplicada1" = Table.DuplicateColumn(#"Colunas Renomeadas1", "data_completa", "data_completa - Copiar"),
    #"Coluna Duplicada2" = Table.DuplicateColumn(#"Coluna Duplicada1", "data_completa - Copiar", "data_completa - Copiar - Copiar"),
    #"Coluna Duplicada3" = Table.DuplicateColumn(#"Coluna Duplicada2", "data_completa - Copiar", "data_completa - Copiar - Copiar.1"),
    #"Coluna Duplicada4" = Table.DuplicateColumn(#"Coluna Duplicada3", "data_completa - Copiar - Copiar", "data_completa - Copiar - Copiar - Copiar"),
    #"Coluna Duplicada5" = Table.DuplicateColumn(#"Coluna Duplicada4", "data_completa - Copiar - Copiar.1", "data_completa - Copiar - Copiar.1 - Copiar"),
    #"Mês Extraído" = Table.TransformColumns(#"Coluna Duplicada5",{{"data_completa - Copiar", Date.Month, Int64.Type}}),
    #"Colunas Renomeadas2" = Table.RenameColumns(#"Mês Extraído",{{"data_completa - Copiar", "mes"}}),
    #"Nome do Mês Extraído" = Table.TransformColumns(#"Colunas Renomeadas2", {{"data_completa - Copiar - Copiar", each Date.MonthName(_), type text}}),
    #"Colunas Renomeadas3" = Table.RenameColumns(#"Nome do Mês Extraído",{{"data_completa - Copiar - Copiar", "nome_mes"}}),
    #"Dia Extraído" = Table.TransformColumns(#"Colunas Renomeadas3",{{"data_completa - Copiar - Copiar.1", Date.Day, Int64.Type}}),
    #"Nome do Dia Extraído" = Table.TransformColumns(#"Dia Extraído", {{"data_completa - Copiar - Copiar - Copiar", each Date.DayOfWeekName(_), type text}}),
    #"Colunas Renomeadas4" = Table.RenameColumns(#"Nome do Dia Extraído",{{"data_completa - Copiar - Copiar.1", "dia"}, {"data_completa - Copiar - Copiar - Copiar", "dia_semana"}, {"data_completa - Copiar - Copiar.1 - Copiar", "trimestre"}}),
    #"Trimestre Calculado" = Table.TransformColumns(#"Colunas Renomeadas4",{{"trimestre", Date.QuarterOfYear, Int64.Type}}),
    #"Tipo Alterado1" = Table.TransformColumnTypes(#"Trimestre Calculado",{{"trimestre", type text}}),
    #"Coluna Duplicada6" = Table.DuplicateColumn(#"Tipo Alterado1", "trimestre", "trimestre - Copiar"),
    #"Valor Substituído" = Table.ReplaceValue(#"Coluna Duplicada6","1","1º Trimestre",Replacer.ReplaceText,{"trimestre - Copiar"}),
    #"Valor Substituído1" = Table.ReplaceValue(#"Valor Substituído","2","2º Trimestre",Replacer.ReplaceText,{"trimestre - Copiar"}),
    #"Valor Substituído2" = Table.ReplaceValue(#"Valor Substituído1","3","3º Trimestre",Replacer.ReplaceText,{"trimestre - Copiar"}),
    #"Valor Substituído3" = Table.ReplaceValue(#"Valor Substituído2","4","4º Trimestre",Replacer.ReplaceText,{"trimestre - Copiar"}),
    #"Colunas Renomeadas5" = Table.RenameColumns(#"Valor Substituído3",{{"trimestre - Copiar", "nome_trimestre"}})
in
    #"Colunas Renomeadas5"
	
	/* CONSTRUÇÃO DA DIMENSÃO DIM_CLIENTE */
	
	let
    Fonte = PostgreSQL.Database("localhost:5432", "cases"),
    case_fpa_stg_vendas = Fonte{[Schema="case_fpa",Item="stg_vendas"]}[Data],
    #"Colunas Removidas" = Table.RemoveColumns(case_fpa_stg_vendas,{"cod_venda", "data_venda", "nm_produto", "dsc_produto", "vlr_produto", "qtde_vendida"}),
    #"Duplicatas Removidas" = Table.Distinct(#"Colunas Removidas", {"cod_cliente"})
in
    #"Duplicatas Removidas"
	
	/* CONSTRUÇÃO DA DIMENSÃO DIM_PRODUTO */
	
	let
    Fonte = PostgreSQL.Database("localhost:5432", "cases"),
    case_fpa_stg_vendas = Fonte{[Schema="case_fpa",Item="stg_vendas"]}[Data],
    #"Coluna Duplicada" = Table.DuplicateColumn(case_fpa_stg_vendas, "nm_produto", "nm_produto - Copiar"),
    #"Colunas Reordenadas" = Table.ReorderColumns(#"Coluna Duplicada",{"cod_venda", "data_venda", "nm_produto - Copiar", "nm_produto", "dsc_produto", "vlr_produto", "qtde_vendida", "cod_cliente", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Valor Substituído" = Table.ReplaceValue(#"Colunas Reordenadas","Mentoria","0004",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído1" = Table.ReplaceValue(#"Valor Substituído","Ebook Data","0001",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído2" = Table.ReplaceValue(#"Valor Substituído1","Ebook Perfil","0002",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Valor Substituído3" = Table.ReplaceValue(#"Valor Substituído2","Curso Analista de dados","0003",Replacer.ReplaceText,{"nm_produto - Copiar"}),
    #"Colunas Removidas" = Table.RemoveColumns(#"Valor Substituído3",{"cod_venda", "data_venda", "qtde_vendida", "cod_cliente", "nm_cliente", "last_cliente", "cpf_cliente", "idade_cliente", "email_cliente"}),
    #"Duplicatas Removidas" = Table.Distinct(#"Colunas Removidas", {"nm_produto - Copiar"}),
    #"Colunas Renomeadas" = Table.RenameColumns(#"Duplicatas Removidas",{{"nm_produto - Copiar", "cod_produto"}})
in
    #"Colunas Renomeadas"