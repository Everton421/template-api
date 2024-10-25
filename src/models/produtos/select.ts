import { conn } from "../../database/databaseConfig"
import { Produto } from "./interface_produto"

export class Select_produtos{

    async   buscaPorCodigo(empresa:any, codigo:number)   {
        return new Promise <Produto[]> ( async ( resolve , reject ) =>{
 
        let sql = ` select * from ${empresa}.produtos where codigo = ? `
            await conn.query(sql, [    codigo], (err, result:Produto[] )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }

async buscaPorCodigoDescricao(empresa:any, codigo:number, descricao:string){

    if(!codigo) codigo = 0; 
    if(!descricao) descricao = '';
     

    const sql = `SELECT * FROM ${empresa}.produtos 
    WHERE  codigo like ? OR descricao = ?    `;
    return new Promise<Produto[]>( async (resolve,reject)=>{
        await conn.query( sql,[ codigo, descricao ], (err, result)=>{
            if(err){ 
                  reject(err)
            }else{
                 resolve(result)
                 }
        } )
    })
}


}