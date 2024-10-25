import { Request, Response } from "express";
import { SelectForma_pagamento } from "../../models/formas_pagamento/select";

export class FormasController{
 

    async buscaGeral(req:Request,res:Response){
      let empresa   = req.headers.cnpj 
      let select = new  SelectForma_pagamento();
  
       if(!empresa){
          return res.json(400).json({erro:"É necessario informar a empresa "});   
       } 
       let  dbName = `\`${empresa}\``;
  
        let fpgt:any;  
  
          try{
            fpgt =   await   select.buscaGeral(dbName  )
                  
        if (fpgt.length === 0) {
          return res.status(404).json({ erro: "Nenhuma forma de pagamento encontrada." });
        }
        return res.status(200).json(fpgt);
  
          }catch(e){ 
                console.error(e);
              return res.status(500).json({ erro: "Erro ao buscar formas de pagamento." });
          }
    }
  
  
  
}  