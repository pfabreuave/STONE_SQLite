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
    const response = await db.all(
    `SELECT polo, stock, venda, dias_Hab,
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
  );
    res.status(200).send({
    stock: response.rows,
    }); 
  };

/*
export async function selectPessoa(req, res){
    let id = req.body.id;
    openDb().then(db=>{
        db.get('SELECT * FROM Pessoa WHERE id=?', [id])
        .then(pessoa=> res.json(pessoa) );
    });
}

export async function insertPessoa(req, res){
    let pessoa = req.body;
    openDb().then(db=>{
        db.run('INSERT INTO Pessoa (nome, idade) VALUES (?,?)', [pessoa.nome, pessoa.idade]);
    });
    res.json({
        "statusCode": 200
    })
}

export async function updatePessoa(req, res){
    let pessoa = req.body;
    openDb().then(db=>{
        db.run('UPDATE Pessoa SET nome=?, idade=? WHERE id=?', [pessoa.nome, pessoa.idade, pessoa.id]);
    });
    res.json({
        "statusCode": 200
    })
}

export async function deletePessoa(req, res){
    let id = req.body.id;
    openDb().then(db=>{
        db.get('DELETE FROM Pessoa WHERE id=?', [id])
        .then(res=>res)
    });
    res.json({
        "statusCode": 200
    })
}
*/