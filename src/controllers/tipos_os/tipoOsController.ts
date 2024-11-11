import { Request, Response } from "express";
import { SelectForma_pagamento } from "../../models/formas_pagamento/select";
import { SelectTipo_os } from "../../models/tipos_os/select";

export class TipoOsController{
 

    async buscaGeral(req:Request,res:Response){
      let empresa   = req.headers.cnpj 
      let select = new  SelectTipo_os();
  
       if(!empresa){
          return res.json(400).json({erro:"É necessario informar a empresa "});   
       } 


       let headerCnpj:any =   String(req.headers.cnpj) ;
       empresa  = headerCnpj.replace(/\D/g, '');

        let  dbName = `\`${empresa}\``;
        let tipoOS:any;  
  
          try{
            tipoOS =   await   select.buscaGeral(dbName  )
                  
        if (tipoOS.length === 0) {
          return res.status(404).json({ erro: "Nenhum tipo de os encontrado." });
        }
        return res.status(200).json(tipoOS);
  
          }catch(e){ 
                console.error(e);
              return res.status(500).json({ erro: "Erro ao buscar  tipos de os pagamento." });
          }
    }
  
  
  
}  