import { openDb } from '../configDB.js';



export async function selectEstoque(req, res){
    openDb().then(db=>{
        db.all('SELECT * FROM estoque')
        .then(estoques=>  res.json(estoques))
    });
}

export async function selectAtendimentos(req, res){
    openDb().then(db=>{
        db.all('SELECT * FROM atendimentos limit 50')
        .then(atendimentos=>  res.json(atendimentos))
    });
}
/*
  consolidação de todos os POLOS das tabelas ATENDIMENTO e STOCK
*/
export async function SumAllStock(req, res)  {
    openDb().then(db=>{db.all
    (`SELECT polo, stock, venda, dias_Hab,
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
GROUP BY atendimentos.polo, estoque.stock) as selt`,
  )
  .then(stock=>  res.json(stock))
    }); 
  };

/*
  consolidação de um POLO das tabelas ATENDIMENTO e STOCK
*/
export async function SumUmStock(req, res)  {
    let polo = req.body.polo;
    openDb().then(db=>{ 
    db.all(`SELECT polo, stock, venda, dias_Hab,
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

WHERE estoque.polo LIKE '%' || $1 || '%'   
GROUP BY atendimentos.polo, estoque.stock) as selt`,
[polo]
  )
  .then(stock=>  res.json(stock))
    }); 
  };

/*
       Atualização do STOCK de um Polo na Tabela de ESTOQUE
*/
       export async function AddStock(req, res)  { 
       
        let stock = req.body;

        openDb().then(db=>{
          db.run("UPDATE estoque SET stock = $1 WHERE polo LIKE '%' || $2 || '%'",
          [stock.stock, stock.polo])
          
        });
        res.json({
            "statusCode": 200
        })
    }