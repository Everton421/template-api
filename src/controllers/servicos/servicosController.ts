import { Request, Response } from "express";
import { Select_servicos } from "../../models/servicos/select";

export class ServicosController{


   
  async buscaGeral(req:Request,res:Response){
    let empresa   = req.headers.cnpj 
   let select = new Select_servicos();

     if(!empresa){
        return res.json(400).json({erro:"É necessario informar a empresa "});   
     } 
     let  dbName = `\`${empresa}\``;

      let servicos:any

        try{
            servicos =   await   select.buscaGeral(dbName  )
                
      if (servicos.length === 0) {
        return res.status(404).json({ erro: "Nenhum servico encontrado." });
      }
      return res.status(200).json(servicos);

        }catch(e){ 
              console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar servico." });
        }
  }


}