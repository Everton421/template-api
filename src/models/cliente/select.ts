import { conn } from "../../database/databaseConfig";
import { Cliente } from "./interface_cliente";


export class Select_clientes{

    async   buscaGeral(empresa:any, vendedor:any )   {
        return new Promise <Cliente[]> ( async ( resolve , reject ) =>{
  

       let sql = ` select * from ${empresa}.clientes c
        WHERE c.ativo = 'S' and 
                       ( c.vendedor = ${vendedor} OR c.vendedor = 0 or c.vendedor = null)
                       order by c.vendedor    `
            await conn.query(sql,  (err, result:Cliente[] )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }
    
    async   buscaPorVendedor(empresa:any, vendedor:number )   {
        return new Promise <Cliente[]> ( async ( resolve , reject ) =>{
        let sql = ` SELECT * FROM ${empresa}.clientes WHERE vendedor = ?  `
            await conn.query(sql, [ vendedor], (err, result:Cliente[] )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }
}

