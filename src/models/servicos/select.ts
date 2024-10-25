import { conn } from "../../database/databaseConfig";


export class Select_servicos{

    async   buscaPorCodigo(empresa:any, codigo:number)   {
        return new Promise  ( async ( resolve , reject ) =>{
 
        let sql = ` select * from ${empresa}.servicos where codigo = ? `
            await conn.query(sql, [ codigo], (err, result  )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }

async buscaPorCodigoDescricao(empresa:any, codigo:number, descricao:string){

    if(!codigo) codigo = 0; 
    if(!descricao) descricao = '';
     

    const sql = `SELECT * FROM ${empresa}.servicos
    WHERE  codigo like ? OR aplicacao = ?    `;
    return new Promise ( async (resolve,reject)=>{
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
    return new Promise   ( async ( resolve , reject ) =>{
    let sql = ` select * from ${empresa}.servicos  `
        await conn.query(sql,  (err, result  )=>{
            if (err)  reject(err); 
              resolve(result)
        })
     })
}


}