import {   Request, Response    } from "express";
import { conn, db_publico } from "../../database/databaseConfig";

    export class Cliente{

          async busca(req: Request, res:Response){

            return new Promise( async (resolve,reject)=>{
            let sql = `
                   SELECT 
                   CODIGO AS codigo,
                   NOME as nome,
                    CPF as cnpj,
                    RG as ie,
                    CELULAR as celular,
                    CEP as cep,
                    ENDERECO as endereco,
                    CIDADE as cidade,
                    NUMERO as numero 
                   
                   FROM ${db_publico}.cad_clie c
                    WHERE c.CODIGO LIKE ? OR c.NOME LIKE ? OR c.CPF LIKE ?
                    AND c.ATIVO = 'S'
                    limit 15
                    ;
                ` ;
                    const reqParam = req.params.cliente;
                    const param = `%${reqParam}%`
                await conn.query(sql, [param , param , param ],(err, result)=>{
                        if(err){
                            console.log(err)
                        }else{
                         resolve( res.json(result));
                        }
                })
            })
        }
        async buscaCompleta(req: Request, res:Response){

            return new Promise( async (resolve,reject)=>{
            let sql = `
                   SELECT 
                   CODIGO AS codigo,
                   NOME as nome,
                    CPF as cnpj,
                    RG as ie,
                    CELULAR as celular,
                    CEP as cep,
                    ENDERECO as endereco,
                    CIDADE as cidade,
                    NUMERO as numero 
                   
                   FROM ${db_publico}.cad_clie c
                     WHERE c.ATIVO = 'S' 
                     
                    ;
                ` ;
                    const reqParam = req.params.cliente;
                    const param = `%${reqParam}%`
                await conn.query(sql, [param , param , param ],(err, result)=>{
                        if(err){
                            console.log(err)
                        }else{
                         resolve( res.json(result));
                        }
                })
            })
        }

    } 