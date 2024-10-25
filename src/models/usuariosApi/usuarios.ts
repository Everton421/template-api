import { conn, db_api } from "../../database/databaseConfig"
import { newUser, UsuarioApi} from "./interface";

export class UsuariosApi{


        async insertUsuario(usuario:newUser){

                return new Promise( async  (resolve, reject)=>{
                    let sql = `
                        INSERT INTO ${db_api}.usuarios
                        (
                            nome, email, cnpj, senha
                        ) values( ?, ?, ?, ? )
                    `;

                    await conn.query(sql, [usuario.usuario, usuario.email, usuario.cnpj, usuario.senha],(err, result )=>{ 
                        if(err) reject(err);
                        else resolve(result);
                    })

                })
        }


        async selectPorNome(nome:string){
            return new Promise( async  (resolve, reject)=>{
                let sql = `
                    select * from ${db_api}.usuarios where nome = ?
                `;

                await conn.query(sql, [ nome ],(err, result )=>{ 
                    if(err) reject(err);
                    else 
                        resolve(result);
                })

            })
    }

    async selectPorEmail(email:string){
        return new Promise< UsuarioApi[]>( async  (resolve, reject)=>{
            let sql = `
                select * from ${db_api}.usuarios where email = ?
            `;

            await conn.query(sql, [ email ],(err, result )=>{ 
                if(err) reject(err);
                else 
                    resolve(result);
            })

        })
    }
 
    async selectPorEmailSenha(email:string, senha:any){
        return new Promise< UsuarioApi[]>( async  (resolve, reject)=>{
            let sql = `
                select * from ${db_api}.usuarios where email = ? and senha = ? 
            `;

            await conn.query(sql, [ email, senha  ],(err, result )=>{ 
                if(err) reject(err);
                else 
                    resolve(result);
            })

        })
}



}