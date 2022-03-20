import { Router } from "express";
import { selectEstoque, selectAtendimentos, SumAllStock } from './Controler/Servicios.js';

const router = Router();

router.get('/', (req, res)=>{
    res.json({
        "statusCode": 200,
        "msg": "Api Rodando"
    })
})


router.get('/estoques', selectEstoque);
router.get('/atendimentos', selectAtendimentos);
// ==> Rota responsável por consolidar a tabela de atendimento por pólo: (GET): localhost:3000/api/stock
router.get('/stock', SumAllStock);
/*
router.get('/pessoa', selectPessoa);
router.post('/pessoa', insertPessoa);
router.put('/pessoa', updatePessoa);
router.delete('/pessoa', deletePessoa);
*/
export default router;