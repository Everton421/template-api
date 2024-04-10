import { Request, Response, response } from "express";
import { conn, db_publico, db_estoque, db_vendas } from "../../database/databaseConfig";

export class Acerto{


    
      async insereAcerto(req: Request, res: Response, json: any, dbestoque:any) {
        const { codigoSetor,  estoque, produto, } = json;
        try {
            const sql = `UPDATE ${db_estoque}.prod_setor
                              SET ESTOQUE = ?
                              WHERE PRODUTO = ? AND setor = ?; 
                              `;

                              const sql2 = `INSERT INTO ${dbestoque}.prod_setor values 
                              (?,?,?) ON DUPLICATE KEY UPDATE ESTOQUE = ${estoque}
                              `
    
            await conn.query(sql2,  [estoque, produto, codigoSetor],(err: any, result: any) => {
              if (err) {
               res.status(500).json({ err: "erro ao atualizar" });
                console.log(err)
              } else {
                res.status(200).json({ "ok": `produto ${produto} atualizado` });
              }
            });

        } catch (error) {
         //console.log("erro ao buscar produto:", error);
          res.status(500).json({ err: "erro ao atualizar produto" });
        }
      }
    

}
