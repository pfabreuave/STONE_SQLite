import { Router } from "express";
import { selectEstoque, selectAtendimentos, SumAllStock, SumUmStock, UpdStock } from './Controler/Servicios.js';

const router = Router();

router.get('/', (req, res)=>{
    res.json({
        "statusCode": 200,
        "msg": "Api Rodando"
    })
})


router.get('/estoques', selectEstoque);
router.get('/atendimentos', selectAtendimentos);

// ==> Rota responsável por consolidar a tabela de atendimento por pólo: (GET): localhost:3000/stock
router.get('/stocks/', SumAllStock);

// ==> Rota responsável por consolidar a tabela de atendimento por pólo: (GET): localhost:3000/stock/:polo
router.get('/stock/', SumUmStock);

// ==> Rota responsável por criar um novo 'Stock': (POST): localhost:4000/api/stock/:polo
router.put('/stock/', UpdStock);

export default router;