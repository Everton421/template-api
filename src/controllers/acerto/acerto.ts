import { Request, Response, response } from "express";
import { conn, db_publico, db_estoque, db_vendas } from "../../database/databaseConfig";

export class Acerto{


    
      async insereAcerto(req: Request, res: Response, json: any, dbestoque:any) {
        const { setor,  codigo, estoque  } = json;
        if(!setor){
          return res.json({msg: "não informado o setor!"})
        }
        if(!codigo){
          return res.json({msg: "não informado o Produto!"})
        }
        if(!estoque){
          return res.json({msg: "não informado o novo saldo!"})
        }
        try {
          
                              const sql2 = `INSERT INTO ${dbestoque}.prod_setor  ( SETOR, PRODUTO, ESTOQUE)
                              VALUES (?,?,?) ON DUPLICATE KEY UPDATE ESTOQUE = ${estoque}
                              `
    
            await conn.query(sql2,  [ setor , codigo, estoque ],(err: any, result: any) => {
              if (err) {
               res.status(500).json({ msg: "erro ao atualizar" });
                console.log(err)
              } else {
                res.status(200).json({ "ok": `produto ${codigo} atualizado` });
              }
            });

        } catch (error) {
         //console.log("erro ao buscar produto:", error);
          res.status(500).json({ err: "erro ao atualizar produto" });
        }
      }
    

}
