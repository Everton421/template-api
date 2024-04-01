import { Router,Request,Response } from "express";
import { produto } from "./controllers/produtos/produtos";
import { controlerOrcamento } from "./controllers/orcamento/orcamento";
import { Cliente } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";
import { conn, connDigital, connEletrodigital, connFilialsc, connSpace, db_estoque, db_publico, estoqueEletrodigital, estoqueFilialsc, estoqueSpace, publicoEletrodigital, publicoFilialsc, publicoSpace } from "./database/databaseConfig";
import { InsereProdutos } from "./controllers/produtos/insereProdutos";

const router = Router();

    router.get('/',(req:Request, res:Response)=>{
      return  res.json({"ok":true});
    })

    router.post('/teste',(req:Request, res:Response)=>{
      console.log(req.body);
//        return res.json(req.body);
    })

/* ------------busca 1 produto com suas configurações------------ */ 
    router.get('/produto/:produto',async(req:Request, res:Response)=>{
      //return  res.json({"ok":true});
      const obj = new produto();
    const aux = await obj.buscaProduto( connFilialsc ,req,res , estoqueFilialsc, publicoFilialsc);

     res.json(aux)
    })


      router.get('/produtos/:produto', async (req: Request, res: Response) => {
        const a = new produto();
        const aux = await a.busca(connFilialsc,req,res );
        res.json(aux)
      });
     

      router.post('/produto/cadastrar', async (req: Request, res: Response) => {
        const json = req.body;
        //console.log(json)

         const a = new InsereProdutos();
         try{
         await a.insertProduto(json.produto, conn, db_publico);
        
        res.status(200).json({"ok": "produto cadastrado"})
        }
        catch(err){
          res.json(err);
        }
         //
        //const result = await a.index(json, conn, db_publico, db_estoque,res);
        //
        //if (result) {
        //    res.status(200).json({ result }); 
        //} else {
        //    res.status(500).json({ error: "Erro ao cadastrar o produto." }); 
        //}
    

      });

    

    export {router} 