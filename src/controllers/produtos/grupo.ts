export class Grupo{

    
    async buscaGrupo(conexao:any, dbpublico:any, req:any,res:any){

        const consulta = req.params.grupo
        const grupo = `%${consulta}%`

        return new Promise( async (resolve,reject)=>{
            const sql = ` SELECT CODIGO codigo, NOME nome  
            FROM ${dbpublico}.cad_pgru WHERE NOME LIKE ? LIMIT 1` ;
            await conexao.query(sql,  [grupo] ,(err:any, result:any)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }

}