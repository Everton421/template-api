 
import { Cliente } from "./interface_cliente";
import {conn} from '../../database/databaseConfig'

export class Insert_clientes{

    async   buscaGeral(empresa:any, cliente:Cliente )   {
        return new Promise  ( async ( resolve , reject ) =>{
        let sql =
         `  
         INSERT INTO 
         ${empresa}.clientes
              ( codigo , 
                celular, 
                nome ,
                cep ,
                endereco ,
                ie ,
                numero ,
                cnpj ,
                cidade ,
                data_cadastro ,
                data_recadastro ,
                vendedor
               ) values
                (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
            `   
                const dados = [ cliente.codigo, cliente.celular, cliente.nome, cliente.cep, cliente.endereco, cliente.ie, cliente.numero, 
                    cliente.cnpj, cliente.cidade, cliente.data_cadastro, cliente.data_recadastro, cliente.vendedor ]

             await conn.query(sql, dados, (err, result:Cliente[] )=>{
                if (err)  reject(err); 
                  resolve(result)
            })
         })
    }
  
}

