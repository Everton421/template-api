import { conn } from "../../database/databaseConfig"

export class Insert_Marcas{

    async cadastrar( empresa:string, marca:any ){
        return new Promise( async (resolve, reject )=>{
            
            let sql = `
                    INSERT INTO ${empresa}.marcas ( id, data_cadastro, data_recadastro, descricao ) VALUES
                                                      ( ? , ? , ? , ? ); `;
            const values = [ marca.id , marca.data_cadastro, marca.data_recadastro, marca.descricao]

            await conn.query( sql , values,(err, result )=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })  
        })
    }
}