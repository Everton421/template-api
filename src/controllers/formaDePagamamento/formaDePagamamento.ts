import { Request, Response } from "express";
import { conn, db_financeiro, db_publico} from "../../database/databaseConfig";

    export class formaDePagamamento{

        async busca(req:Request,res:Response){

     const sql = ` SELECT 
                    CODIGO as codigo,
                    DESCRICAO as descricao,
                    DESC_MAXIMO as desc_maximo,
                    NUM_PARCELAS as parcelas,
                    INTERVALO as intervalo,
                    TIPO_RECEBIMENTO AS recebimento
                    FROM ${db_publico}.cad_fpgt;`
            return new Promise((reject, resolve)=>{
                conn.query(sql, (err, result)=>{
                    if(err){
                        throw err;
                    }else{
                        res.json(result);
                    }
                })
            })
        }

    }