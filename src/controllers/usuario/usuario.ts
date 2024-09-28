import { Request, Response } from "express";
import { conn, db_publico } from "../../database/databaseConfig";

export class Usuario{

    async usuarioSistema(conexao:any, dbpublico:any, nome:String, senha:string){

        return new Promise( async (resolve , reject )=>{
            
            const sql = 
            ` SELECT APELIDO AS nome , SENHA_WEB AS senha , CODIGO as codigo  FROM  ${dbpublico}.cad_vend 
                WHERE APELIDO = ? AND SENHA_WEB = ?;
            `;

            await conexao.query( sql,[nome, senha], (err:any ,result:any)=>{
                if(err){
                    reject(err);
                }{
                    resolve(result[0]);
                }
            });
        })
    }
    


 async busca(  request:Request, response:Response ){
return new Promise( async (resolve,reject)=>{

    let sql =  
    `SELECT 
      codigo,
      senha_web,
      APELIDO AS nome ,
      data_nasc as data_nascimento,
      apelido,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      telefone,
      celular,
      email,
      cpf 
      supervisor,
    tipo,
     CASE
      WHEN tipo =  'V' THEN   'vendedor'
      WHEN tipo =  'F' THEN   'funcionario'
      WHEN tipo =  'I' THEN   'indicacao'
      WHEN tipo =  'T' THEN   'tecnico'
      else tipo 
      end as tipo_funcionario
     
    FROM ${db_publico}.cad_vend where ATIVO = 'S';`
    
     await conn.query(sql, (err,result)=>{
        if(err){ 
            reject(err);
        }else{
            console.log(result)
            resolve( response.json(result) );
        }
    })
})


    }
}