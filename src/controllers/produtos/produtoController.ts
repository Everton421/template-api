import { Request, Response } from "express";
import { Select_produtos } from "../../models/produtos/select";
import { Produto } from "../../models/produtos/interface_produto";

export class ProdutoController{
 

 

  async buscaGeral(req:Request,res:Response){
    let empresa   = req.headers.cnpj 
   let select = new Select_produtos();

     if(!empresa){
        return res.json(400).json({erro:"É necessario informar a empresa "});   
     } 
     let  dbName = `\`${empresa}\``;

      let produtos:Produto[]

        try{
            produtos =   await   select.buscaGeral(dbName  )
                
      if (produtos.length === 0) {
        return res.status(404).json({ erro: "Nenhum produto encontrado." });
      }
      return res.status(200).json(produtos);

        }catch(e){ 
              console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar produtos." });
        }
  }

async cadastrar(req:Request,res:Response){
  let empresa   = req.headers.cnpj 
   let select = new Select_produtos();

     if(!empresa){
        return res.json(400).json({erro:"É necessario informar a empresa "});   
     } 
     let  dbName = `\`${empresa}\``;
     let produtos:Produto[]

     try{
      produtos =   await   select.buscaGeral(dbName  )
     }catch(e){

     }

}


/** 
  async buscaPorCodigo(req:Request,res:Response){
    let empresa   = req.query.cnpj 
    let codigo:number  = Number(req.query.codigo) 
   let select = new Select_produtos();
 
     if(!empresa){
        return res.json(400).json({erro:"É necessario informar a empresa "});   
     } 
     if(!codigo){
        return res.json(400).json({erro:"É necessario informar o codigo do produto "});   
     } 

    let produtos:Produto[]
    
        try{
            produtos =   await   select.buscaPorCodigo(empresa, codigo)
                
      if (produtos.length === 0) {
        return res.status(404).json({ erro: "Nenhum produto encontrado." });
      }
      return res.status(200).json(produtos);

        }catch(e){ 
              console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar produtos." });
        }
  }
 
  async buscaPorCodigoDescricao(req:Request,res:Response){
    let empresa   = req.query.cnpj 
    let codigo:number  = Number(req.query.codigo) 
    let descricao:string = String(req.query.descricao)

   let select = new Select_produtos();
 
     if(!empresa){
        return res.json(400).json({erro:"É necessario informar a empresa "});   
     } 
     if(!codigo){
        return res.json(400).json({erro:"É necessario informar o codigo do produto "});   
     } 

    let produtos:Produto[]
        try{
            produtos =   await   select.buscaPorCodigoDescricao(empresa, codigo, descricao )
                
      if (produtos.length === 0) {
        return res.status(404).json({ erro: "Nenhum produto encontrado." });
      }
      return res.status(200).json(produtos);

        }catch(e){ 
              console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar produtos." });
        }
  }
*/



}

 
   