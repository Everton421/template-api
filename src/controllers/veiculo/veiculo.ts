import { Request, Response } from "express";
import { conn, db_publico } from "../../database/databaseConfig"

export class Veiculo{



    
async busca(  request:Request, response:Response ){
    return new Promise( async ( resolve, reject )=>{
        
    console.log(request.params.veiculo);

let param = `%${request.params.veiculo}%`;

 let sql = ` SELECT 
          CODIGO as codigo ,
          CLIENTE as cliente,
          PLACA as placa,
          MARCA as marca,
          MODELO as modelo,
          ANO as ano,
          COR as cor,
          ULT_ATENDIMENTO as ultimo_atendimento, 
          ULT_KM as ultimo_km,
          ULT_MECANICO as ultimo_mecanico,
          OBSERVACOES as observacoes,
          DATA_CADASTRO as data_cadastro,
          ULT_REVISAO as ult_revisao,
          ULT_KM_REV as ultimo_km_rev,
          ULT_MECANICO_REV as ultimo_mecanico_rev,
          COMBUSTIVEL as  combustivel
  
 FROM ${db_publico}.cad_veic
                   
                   where
                   ( placa like  ? or codigo like ? )
                       order by codigo ;`
            
     await conn.query(sql, [ param, param], (err, result)=>{
         if(err){
             reject(err);
         }else{
//            console.log('');
//            console.log(result);
            resolve( response.status(200).json(result) );
         }
     })
 
}

)
}



    async buscaTodos( request:Request, response:Response ){


        return new Promise( async ( resolve ,reject )=>{
            let sql = `SELECT 
            CODIGO as codigo ,
            CLIENTE as cliente,
            PLACA as placa,
            MARCA as marca,
            MODELO as modelo,
            ANO as ano,
            COR as cor,
            COMBUSTIVEL as combustivel
            FROM ${db_publico}.cad_veic`;
    


            await conn.query( sql , ( err, result )=>{
                if( err ){
                    console.log(err)
                    reject(err)
                     
                }else{
                    //console.log(result)
             resolve( response.status(200).json(result) );
                }
            })           
        })

 
    }

}