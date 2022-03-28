SELECT polo, stock, venda, dias_Hab,
            (venda / dias_hab) as media,
            (stock / (venda / dias_hab) )  as auto,
            CASE WHEN ((stock / (Venda / Dias_Hab))) < 10 THEN 1
            WHEN ((stock / (Venda / Dias_Hab))) >= 10 AND ((stock / (Venda / Dias_Hab))) <= 13 THEN 2
            WHEN ((stock / (Venda / Dias_Hab))) >= 14 AND ((stock / (Venda / Dias_Hab))) <= 18 THEN 3
            WHEN ((stock / (Venda / Dias_Hab))) >= 19 AND ((stock / (Venda / Dias_Hab))) <= 23 THEN 4
            ELSE 5 END
            AS cat,
            CASE WHEN ((stock / (Venda / Dias_Hab))) >= 14 AND ((stock / (Venda / Dias_Hab))) <= 18 THEN 0
            ELSE (14 - ((stock / (Venda / Dias_Hab)))) * (Venda / Dias_Hab) END AS rep
    FROM (SELECT  atendimentos.polo, 
          COUNT(*) as venda,
          COUNT(distinct fecha) as Dias_Hab,
          estoque.stock
          FROM atendimentos
    JOIN estoque
    ON (atendimentos.polo = estoque.polo)   
    GROUP BY atendimentos.polo, estoque.stock) as selt;