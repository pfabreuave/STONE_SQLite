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

           WHERE estoque.polo LIKE '%' || 'MG -' || '%'   
           GROUP BY atendimentos.polo, estoque.stock) as t