import { Router,Request,Response, NextFunction } from "express";
import { conn,conn2,db_estoque, db_estoque2, db_publico, db_publico2 } from "./database/databaseConfig";
import 'dotenv/config';
//import { Orcamento_service } from "./controllers/orcamento/orcamento_service";
import { checkToken } from "./middleware/cheqtoken";
import { Select_produtos } from "./models/produtos/select";
import { ProdutoController } from "./controllers/produtos/produtoController";

  const crypt = require('crypt');
  const router = Router();
  export const versao = '/v1'

    router.get(`${versao}/`, async (req:Request, res:Response)=>{
      await conn.getConnection(
        async (err:Error)=>{
          if(err){
              return res.status(500).json({"erro": "falha ao se conectar ao banco de dados1 "})
          }else{
          //  res.header("Access-Control-Allow-Origin", "*");
          //  res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
            return  res.json({"ok":true});
          }
        }
      )
    })

 
//    router.get(`${versao}/teste`, ( req, res )=>{
//      console.log(req.body)
 //   })
 
//router.get(`${versao}/pedidos/:codigo`, checkToken , new Orcamento_service().selecionaPorCodigo)
 router.get(`${versao}/teste`,   new ProdutoController().buscaPorCodigo  )

 

/**___________ */

    export {router} 