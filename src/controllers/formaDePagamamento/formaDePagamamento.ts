import { Request, Response } from "express";
import { conn, db_financeiro, db_publico} from "../../database/databaseConfig";

    export class formaDePagamamento{

        async busca(req:Request,res:Response){

            const sql = ` SELECT * FROM ${db_publico}.cad_fpgt;`
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