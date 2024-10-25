import { conn } from "../../database/databaseConfig";

export class SelectForma_pagamento{


    async   buscaGeral(empresa:any )   {
        return new Promise   ( async ( resolve , reject ) =>{
        let sql = ` select * from ${empresa}.forma_pagamento  `
            await conn.query(sql,  (err, result  )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }
    
  
}