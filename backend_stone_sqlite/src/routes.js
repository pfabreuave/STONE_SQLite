import { Router } from "express";
import { selectStocks, selectStock, UpdStock, selectEstoque, selectAtendimentos   } from './Controler/Stock.js';

const router = Router();

router.get('/', (req, res)=>{
    res.json({
        "statusCode": 200,
        "msg": "Api Rodando"
    })
})
// ==> listado completo de la tabela estoque
router.get('/estoques', selectEstoque);
// ==> listado de 50 registros de la tabela de atendimentos
router.get('/atendimentos', selectAtendimentos);
// ==> consolidad todos lo movimientos de cada POLO y calcula la reglas de negocio
router.get('/stocks', selectStocks);
// ==> consolidad todos lo movimientos de cada POLO y calcula la reglas de negocio
router.post('/stockp', selectStock);
// ==> actualiza el stock de un POLO
router.post('/stock/', UpdStock);

export default router;