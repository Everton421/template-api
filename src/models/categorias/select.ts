import { conn } from "../../database/databaseConfig"


export class Select_Categorias{


    async busca_por_descricao(empresa:string, descricao:string ){

        return new Promise( async (resolve, reject)=>{

             let sql = ` SELECT *,
                DATE_FORMAT(data_cadastro, '%Y-%m-%d') AS data_cadastro,
                DATE_FORMAT(data_recadastro, '%Y-%m-%d %H:%i:%s') AS data_recadastro
             FROM ${empresa}.categorias 
               WHERE descricao = '${descricao}' `
 
            await conn.query( sql  ,(err, result )=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

    async busca_geral(empresa:string ){

        return new Promise( async (resolve, reject)=>{

             let sql = ` SELECT *,
                DATE_FORMAT(data_cadastro, '%Y-%m-%d') AS data_cadastro,
                DATE_FORMAT(data_recadastro, '%Y-%m-%d %H:%i:%s') AS data_recadastro
             FROM ${empresa}.categorias `
 
            await conn.query( sql  ,(err, result )=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

}