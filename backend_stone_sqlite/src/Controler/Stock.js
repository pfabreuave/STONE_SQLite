import { openDb } from '../configDB.js';


/*   para crear a futuro la tabela consolidada por polo


export async function createTable(){
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS consolidada ( id INTEGER PRIMARY KEY, xxxx EXT, yyyy INTEGER )')
    })
}
*/

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

export async function selectStocks(req, res){
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
      COUNT(distinct fecha) as dias_hab,
      estoque.stock
      FROM atendimentos
    JOIN estoque
    ON (atendimentos.polo = estoque.polo)   
    GROUP BY atendimentos.polo, estoque.stock) as selt`,
      )
        .then(stocks=>  res.json(stocks))
    });
}

/*
  consolidação de um POLO das tabelas ATENDIMENTO e STOCK
*/

export async function selectStockp(req, res)  {
    let stock = req.body;
    openDb().then(db=>{ 
    const response = db.all(`SELECT polo, stock, venda, dias_Hab,
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
  COUNT(distinct fecha) as dias_hab,
  estoque.stock
  FROM atendimentos
JOIN estoque
ON (atendimentos.polo = estoque.polo)

WHERE estoque.polo LIKE '%' || $1 || '%'   
GROUP BY atendimentos.polo, estoque.stock) as selt`,
[stock.polo]
  )
  .then(stock=>  res.json(stock))
    }); 
  };

/*
       Atualização do STOCK de um Polo na Tabela de ESTOQUE
*/
export async function UpdStock(req, res)  { 
       
    let stock = req.body;

    openDb().then(db=>{
      db.run("UPDATE estoque SET stock = $1 WHERE polo LIKE '%' || $2 || '%'",
      [stock.stock, stock.polo])
      
    });
    res.json({
        "statusCode": 200,
         "stock": stock
    })
    
} 


/*
  consolidação de todos os POLOS das tabelas ATENDIMENTO e STOCK dias calendario como base
*/

export async function selectStockhs(req, res){
  openDb().then(db=>{
      db.all(`SELECT polo, stock, venda, dias_efect, desde, hasta, dias_hab,
            
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
            estoque.stock
            FROM atendimentos
      JOIN estoque
      ON (atendimentos.polo = estoque.polo)   
      GROUP BY atendimentos.polo, estoque.stock) as selt;`,
    )
      .then(stocks=>  res.json(stocks))
  });
}

/*
consolidação de um POLO das tabelas ATENDIMENTO e STOCK dias calendario como base
*/

export async function selectStockhp(req, res)  {
  let stock = req.body;
  openDb().then(db=>{ 
  const response = db.all(`SELECT polo, stock, venda, dias_efect, desde, hasta, dias_hab,
            
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
        estoque.stock
        FROM atendimentos

  JOIN estoque
  ON (atendimentos.polo = estoque.polo)

  WHERE estoque.polo LIKE '%' || $1 || '%'   
  GROUP BY atendimentos.polo, estoque.stock) as selt`,
  [stock.polo]
  )
  .then(stock=>  res.json(stock))
  }); 
};





