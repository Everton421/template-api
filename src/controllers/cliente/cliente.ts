import { Request, Response, response } from "express";
import { conn, db_publico } from "../../database/databaseConfig";

    export class Cliente{

        async busca(req:Request){

            return new Promise( async (resolve,reject)=>{
            let sql = `
                   SELECT * FROM space_publico.cad_clie c
                    WHERE c.CODIGO LIKE ? OR c.NOME LIKE ? OR c.CPF LIKE ?
                    limit 15
                    ;
                ` ;
                    const reqParam = req.params.cliente;
                    const param = `%${reqParam}%`
                await conn.query(sql, [param , param , param ],(err, result)=>{
                        if(err){
                            console.log(err)
                        }else{
                         resolve(result);
                        }
                })
            })
        }
    } 