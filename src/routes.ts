import { Router,Request,Response } from "express";
import { produto } from "./controllers/produtos/produtos";
import { controlerOrcamento } from "./controllers/orcamento/orcamento";
import { Cliente } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";
import { conn, connFilialsc, db_estoque, db_publico } from "./database/databaseConfig";
import { InsereProdutos } from "./controllers/produtos/insereProdutos";

const router = Router();

    router.get('/',(req:Request, res:Response)=>{
      return  res.json({"ok":true});
    })

    router.post('/teste',(req:Request, res:Response)=>{
        console.log(req.body);
    })

/* busca 1 produto com suas configurações */ 
    router.get('/produto/:produto',async(req:Request, res:Response)=>{
      //return  res.json({"ok":true});
      const obj = new produto();
      const aux = await obj.buscaProduto( conn ,req,res ,  db_estoque, db_publico);
     res.json(aux)
    })


      router.get('/produtos/:produto', async (req: Request, res: Response) => {
        const a = new produto();
        const aux = await a.busca(connFilialsc,req,res );
        res.json(aux)
      });
     

      router.post('/produto/cadastrar', async (req:Request ,res:Response )=>{
        const a = new InsereProdutos();
        try{
       const aux = await a.index( req.body, conn , db_publico,db_estoque ,req,res); 
       res.json({"produto cadastrado":aux});
      }catch(err){
        console.log(err);
      }
       //res.json('produto cadastrado');
      })

    export {router} 