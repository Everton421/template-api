import { Request, Response } from "express";
import { Select_veiculos } from "../../models/veiculo/select";

export class VeiculoController{

    async  busca( req:Request,res:Response ) {
        
        let selectVeiculos = new Select_veiculos();
        if(!req.headers.cnpj ){
            return res.status(200).json({erro:"É necessario informar a empresa "});   
         } 
         let headerCnpj:any =   req.headers.cnpj ;
         let empresa  = headerCnpj.replace(/\D/g, '');
         let  dbName = `\`${empresa}\``;
    

            try{
                 let dados:any[] = await selectVeiculos.buscaGeral(dbName);
                        if(dados.length > 0 ){
                            return res.status(200).json(dados);
                        }else{
                            return res.status(200).json({"msg": "Nenhum veiculo encontrado!"})
                        }

            }catch(err){
              return res.status(500).json({ erro: "Erro ao buscar veiculos." });
             }

    }
}