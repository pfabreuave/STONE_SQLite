import { Router } from "express";
import { selectStocks, selectStockp, UpdStock, selectEstoque, selectAtendimentos, selectStockhs, selectStockhp } from './Controler/Stock.js';

const router = Router();

router.get('/', (req, res)=>{
    res.json({
        "statusCode": 200,
        "msg": "Api Rodando"
    })
})
// ==> listado completo de la tabela estoque
router.get('/estoques/', selectEstoque);
// ==> listado de 50 registros de la tabela de atendimentos
router.get('/atendimentos/', selectAtendimentos);
// ==> consolidad todos lo movimientos de cada POLO y calcula la reglas de negocio
router.get('/stocks/', selectStocks);
// ==> consolidad todos lo movimientos de un POLO o GRUPO y calcula la reglas de negocio
router.post('/stockp/', selectStockp);
// ==> actualiza el stock de un POLO
router.post('/stock/', UpdStock);
// ==> consolidad todos lo movimientos de cada POLO y calcula la reglas de negocio
router.get('/stockhs/', selectStockhs);
// ==> consolidad todos lo movimientos de un POLO o GRUPO y calcula la reglas de negocio
router.post('/stockhp/', selectStockhp);

export default router;