
-- Neste SQL, é estabelecida uma nova base  de cálculo, pois os dias  de vendas 
-- são considerados dias úteis corridos, por isso é determinada a data mínima e 
-- máxima para cada polo na base de dados,  pois todos os cálculos são baseados 
-- nos dias de vendas, os resultados são significativamente diferentes
--

SELECT polo, stock, venda, dias_efect, desde, hasta, dias_hab,
            
			CAST((venda / dias_hab) AS INTEGER) as media,
			CAST(stock / (venda / dias_hab) AS INTEGER)  as auto,
            CASE WHEN ((stock / (Venda / dias_hab))) < 10 THEN 1
            WHEN ((stock / (venda / dias_hab))) >= 10 AND ((stock / (venda / dias_hab))) <= 13 THEN 2
            WHEN ((stock / (venda / dias_hab))) >= 14 AND ((stock / (venda / dias_hab))) <= 18 THEN 3
            WHEN ((stock / (venda / dias_hab))) >= 19 AND ((stock / (venda / dias_hab))) <= 23 THEN 4
            ELSE 5 END
            AS cat,
            CASE WHEN ((stock / (venda / dias_hab))) >= 14 AND ((stock / (venda / dias_hab))) <= 18 THEN 0
            ELSE CAST(((14 - ((stock / (venda / dias_hab)))) * (venda / dias_hab)) AS INTEGER) END AS rep
    FROM (SELECT  atendimentos.polo, 
          COUNT(*) as venda,
          COUNT(distinct fecha) as dias_efect,
		  MIN(fecha) as desde,
		  MAX(fecha) as hasta,
		 (CAST(strftime("%J", MAX(fecha)) - strftime("%J", MIN(fecha)) AS INTEGER)) AS dias_hab,
		-- DATE(substr(MIN(fecha),7)||substr(MIN(fecha),4,2)||substr(MIN(fecha),1,2)) as ff,
		
          estoque.stock
          FROM atendimentos
    JOIN estoque
    ON (atendimentos.polo = estoque.polo)   
    GROUP BY atendimentos.polo, estoque.stock) as selt;