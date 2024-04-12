export class Marcas{

    async buscaMarcas(conexao:any, dbpublico:any, req:any,res:any){

        const consulta = req.params.marca
        const marca = `%${consulta}%`

        return new Promise( async (resolve,reject)=>{
            const sql = ` SELECT CODIGO codigo, DESCRICAO descricao  
            FROM ${dbpublico}.cad_pmar WHERE DESCRICAO LIKE ? LIMIT 1` ;
            await conexao.query(sql,  [marca] ,(err:any, result:any)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

}