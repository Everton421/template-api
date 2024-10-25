import { conn } from "../../database/databaseConfig";

export class SelectTipo_os{


    async   buscaGeral(empresa:any )   {
        return new Promise   ( async ( resolve , reject ) =>{
        let sql = ` select * from ${empresa}.tipo_os  `
            await conn.query(sql,  (err, result  )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }
    
  
}