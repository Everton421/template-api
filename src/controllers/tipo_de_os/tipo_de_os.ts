
import { Request, Response, response } from "express";
import { conn, db_publico } from "../../database/databaseConfig";


export class Tipo_de_os{

    
    async busca( request:Request, response:Response){
 
        return new Promise( async (resolve,reject)=>{
            
            const sql = ` SELECT 
                            CODIGO codigo,
                             DESCRICAO descricao,
                             EXIGIR_LAUDO exigir_laudo  
                FROM ${db_publico}.tipos_os ` ;

            await conn.query(sql,   (err:any, result:any)=>{
                if(err){
                    reject(err)
                }else{

                    response.status(200).json(result)
                    resolve(result)
                }
            })
        })
    }

 

 }