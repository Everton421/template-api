import { conn } from "../../database/databaseConfig"
import { Produto } from "./interface_produto"

export class Select_produtos{

    async   buscaPorCodigo(empresa:any, codigo:number)   {
        return new Promise <Produto[]> ( async ( resolve , reject ) =>{
 
        let sql = `
         select 
            *,
             CONVERT(observacoes1 USING utf8) as observacoes1,
             CONVERT(observacoes2 USING utf8) as observacoes2,
             CONVERT(observacoes3 USING utf8) as observacoes3
        from ${empresa}.produtos where codigo = ? `
            await conn.query(sql, [    codigo], (err, result:Produto[] )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }

async buscaPorCodigoDescricao(empresa:any, codigo:number, descricao:string){

    if(!codigo) codigo = 0; 
    if(!descricao) descricao = '';
     

    const sql = `SELECT *, 
                  CONVERT(observacoes1 USING utf8) as observacoes1,
                  CONVERT(observacoes2 USING utf8) as observacoes2,
                  CONVERT(observacoes3 USING utf8) as observacoes3

            FROM ${empresa}.produtos 
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


async   buscaGeral(empresa:any )   {
    return new Promise <Produto[]> ( async ( resolve , reject ) =>{
        let sql = ` select 
        *,
             CONVERT(observacoes1 USING utf8) as observacoes1,
             CONVERT(observacoes2 USING utf8) as observacoes2,
             CONVERT(observacoes3 USING utf8) as observacoes3
        from ${empresa}.produtos  `
        await conn.query(sql,  (err, result:Produto[] )=>{
            if (err)  reject(err); 
              resolve(result)
        })
     })
}


}