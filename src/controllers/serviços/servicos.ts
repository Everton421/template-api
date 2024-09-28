import { Request, Response } from "express";
import { conn, db_publico } from "../../database/databaseConfig";

export class Servicos{
    


    async  busca( request:Request, response:Response ){

        return new Promise( async (resolve, reject ) =>{
            const sql = `SELECT
                CODIGO as codigo,
                TIPO_SERV as tipo_serv,
                VALOR as valor,
                APLICACAO as aplicacao            
                 
             FROM ${db_publico}.cad_serv;`
            await conn.query( sql ,(err,result)=>{
                if( err ){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(  response.status(200).json( result ))
                }
            });

         })
    }



    async buscaPorAplicacao( request:Request, response:Response ){

        return new Promise( async ( resolve, reject ) =>{

                let param = `'%${request.params.servico}%'`

                console.log(param)

                let sql = 
                ` SELECT 
                CODIGO as codigo,
                TIPO_SERV as tipo_serv,
                VALOR as valor,
                APLICACAO as aplicacao            
                 
             FROM ${db_publico}.cad_serv
             WHERE aplicacao like ${param}
             limit 10
             ` 

             console.log(sql)
            await conn.query(sql, (err,result )=>{
                if(err){
                    console.log(err)
                    reject( response.status(500).json(err))
                }else{
                    resolve(response.status(200).json(result))
                }
            })

        })  

    }
}
