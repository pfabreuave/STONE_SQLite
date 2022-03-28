
/*
Desafio Técnico

VISÃO GERAL

Em qualquer operação logística, escala de atendimento é algo fundamental. A Stone tem
por característica uma enorme capilaridade geográfica, com polos em todas as regiões do Brasil.
O polo é o centro de trabalho dos nossos Green Angels, e, como estoque avançado, é
necessário que seja abastecido com frequência, para que sempre tenhamos terminais a
disposição para atender nossa razão da melhor forma possível. O ideal é que haja cerca de 14
dias de cobertura na ponta, ou seja, estoque suficiente para 14 dias de acordo com a média
diária de consumo.

Regras de negócios (válidas para todos os polos do Brasil)
1. Cobertura de criticidade VERMELHA (PERIGO): abaixo de 10 dias        Criticidade = 1 
2. Cobertura de criticidade AMARELA (ATENÇÃO): de 10 a 13 dias			Criticidade = 2			
3. Cobertura de criticidade VERDE (COBERTURA IDEAL): de 14 a 18 dias	Criticidade = 3
4. Cobertura de criticidade AMARELA (ATENÇÃO):de 19 a 23 dias			Criticidade = 4
5. Cobertura de criticidade VERMELHA (PERIGO): acima de 23				Criticidade = 5

*/

SELECT polo as POLO, stock, Venda, Dias_Hab,
            (Venda / Dias_Hab) as "Media Diaria Consumo",
            (stock / (Venda / Dias_Hab) )  as "Dias Cobertura",
            CASE WHEN ((stock / (Venda / Dias_Hab))) < 10 THEN 1
            WHEN ((stock / (Venda / Dias_Hab))) >= 10 AND ((stock / (Venda / Dias_Hab))) <= 13 THEN 2
            WHEN ((stock / (Venda / Dias_Hab))) >= 14 AND ((stock / (Venda / Dias_Hab))) <= 18 THEN 3
            WHEN ((stock / (Venda / Dias_Hab))) >= 19 AND ((stock / (Venda / Dias_Hab))) <= 23 THEN 4
            ELSE 5 END
            AS Criticidade,
            CASE WHEN ((stock / (Venda / Dias_Hab))) >= 14 AND ((stock / (Venda / Dias_Hab))) <= 18 THEN 0
            ELSE (14 - ((stock / (Venda / Dias_Hab)))) * (Venda / Dias_Hab) END AS Reposicao
    FROM (SELECT  atendimentos.polo, 
          COUNT(*) as Venda,
          COUNT(distinct fecha) as Dias_Hab,
          estoque.stock
          FROM atendimentos
    JOIN estoque
    ON (atendimentos.polo = estoque.polo)    
           GROUP BY atendimentos.polo, estoque.stock) as t