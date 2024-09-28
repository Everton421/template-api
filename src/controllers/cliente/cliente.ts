import {   Request, Response    } from "express";
import { conn, db_publico } from "../../database/databaseConfig";

    export class Cliente{

        async busca(req: Request, res: Response) {
            return new Promise(async (resolve, reject) => {
                let queryVendedor: any = req.query.vendedor;
                const queryClient = req.query.cliente;
        
                // Se queryVendedor não estiver definido ou for null, definir como 0
                if (!queryVendedor || queryVendedor === undefined) {
                    queryVendedor = 0;
                }
        
           
             let sql = `
            SELECT 
                CODIGO AS codigo,
                NOME AS nome,
                CPF AS cnpj,
                RG AS ie,
                CELULAR AS celular,
                CEP AS cep,
                ENDERECO AS endereco,
                CIDADE AS cidade,
                NUMERO AS numero ,
                DATA_CADASTRO as data_cadastro,
                DATA_RECAD  as data_recadastro,
                VENDEDOR as vendedor
            FROM ${db_publico}.cad_clie c
            WHERE
                (c.CODIGO LIKE ? OR c.NOME LIKE ? OR c.CPF LIKE ?)
                AND c.ATIVO = 'S'
                AND (c.VENDEDOR = ? OR c.VENDEDOR = 0)
            LIMIT 15;
        `;

        
                // Preparar os parâmetros para a consulta
                const param = `%${queryClient}%`;
        
                try {
                    const result = await new Promise((resolve, reject) => {
                        conn.query(sql, [param, param, param, queryVendedor], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    });
        
                    // Enviar a resposta com os resultados
                    resolve(res.json(result));
                } catch (err) {
                    // Tratar erros
                    console.error(err);
                    reject(err);
                }
            });
        }
        
        async buscaCompleta(req: Request, res:Response){

            return new Promise( async (resolve,reject)=>{

                const reqParam = req.params.cliente;
                    
                const queryVendedor = req.query.vendedor;

            let sql = `
                   SELECT 
                  CODIGO AS codigo,
                    NOME AS nome,
                    CPF AS cnpj,
                    RG AS ie,
                    CELULAR AS celular,
                    CEP AS cep,
                    ENDERECO AS endereco,
                    CIDADE AS cidade,
                    NUMERO AS numero ,
                    DATA_CADASTRO as data_cadastro,
                    DATA_RECAD  as data_recadastro,
                    VENDEDOR as vendedor
   
                   FROM ${db_publico}.cad_clie c
                     WHERE c.ATIVO = 'S' and 
                       ( VENDEDOR = ${queryVendedor} OR VENDEDOR = 0 or VENDEDOR = null)
                       order by VENDEDOR
                     
                    ;
                ` ;
        

                    const param = `%${queryVendedor}%`
                await conn.query(sql ,(err, result)=>{
                        if(err){
                            console.log(err)
                        }else{
                         resolve( res.json(result));
                        }
                })
            })
        }

    } 