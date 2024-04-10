import { conn, db_publico } from "../../database/databaseConfig";

export class Usuario{

    async usuarioSistema(conexao:any, dbpublico:any, nome:String, senha:string){

        return new Promise( async (resolve , reject )=>{
            
            const sql = 
            ` SELECT APELIDO AS nome , SENHA_WEB AS senha  FROM  ${dbpublico}.cad_vend 
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
    
}