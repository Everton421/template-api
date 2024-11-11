import { Request, Response } from "express";
import { Select_produtos } from "../../models/produtos/select";
import { Produto } from "../../models/produtos/interface_produto";
import { InsertProdutos } from "../../models/produtos/insert";

export class ProdutoController{
 

 

  async buscaGeral(req:Request,res:Response){

    let select = new Select_produtos();

     if(!req.headers.cnpj ){
        return res.status(200).json({erro:"É necessario informar a empresa "});   
     } 

     let headerCnpj:any =   req.headers.cnpj ;
     let empresa  = headerCnpj.replace(/\D/g, '');

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
  if(!empresa){
    return res.json(400).json({erro:"É necessario informar a empresa "});   
 } 
 let  dbName = `\`${empresa}\``;
 let produtos:Produto[]

   let select = new Select_produtos();
   let insert = new InsertProdutos();
 
        if(!req.body.codigo)            return res.status(200).json({ erro: "É necessario informar o codigo para registrar o produto!"});
        if(!req.body.id)                return res.status(200).json({ erro: "É necessario informar o id  para registrar o produto!"});
        if(!req.body.grupo)             return res.status(200).json({ erro: "É necessario informar o grupo para registrar o produto!"});
        if(!req.body.descricao)         return res.status(200).json({ erro: "É necessario informar a descrição para registrar o produto!"});
        if(!req.body.num_fabricante)    return res.status(200).json({ erro: "É necessario informar o codigo de barras para registrar o produto!"});
        if(!req.body.num_original)      return res.status(200).json({ erro: "É necessario informar a referência  para registrar o produto!"});
        if(!req.body.sku)               return res.status(200).json({ erro: "É necessario informar o sku  para registrar o produto!"});
        if (!req.body.ativo)            return res.status(200).json({ erro: "É necessario informar o status do produto !"});
        if (!req.body.class_fiscal)     return res.status(200).json({ erro: "É necessario informar o ncm  para registrar o produto!"});
        if (!req.body.cst)              return res.status(200).json({ erro: "É necessario informar  cst para registrar o produto!"});

        //  if (!req.body.tipo)  tipo = 0;
        //if (!observacoes1)     return res.status(200).json("É necessario informar  para registrar o produto!")
        //if (!observacoes2)     return res.status(200).json("É necessario informar  para registrar o produto!")
        //if (!observacoes3)     return res.status(200).json("É necessario informar  para registrar o produto!")
        //  if (!observacoes1)   observacoes1 = '' 
        //  if (!observacoes2)   observacoes2 = ''
        //  if (!observacoes3)   observacoes3 = ''
        let produto =  {
          "codigo"          : req.body.codigo,
          "id"              : req.body.id,
          "estoque"         : req.body.estoque,
          "preco"           : req.body.preco,
          "grupo"           : req.body.grupo,
          "origem"          : req.body.origem,
          "descricao"       : req.body.descricao,
          "num_fabricante"  : req.body.num_fabricante,
          "num_original"    : req.body.num_original,
          "sku"             : req.body.sku,
          "marca"           : req.body.marca,
          "ativo"           : req.body.ativo,
          "class_fiscal"    : req.body.class_fiscal,
          "cst"             : req.body.cst,
          "data_recadastro" : req.body.data_recadastro,
          "data_cadastro"   : req.body.data_cadastro,
          "observacoes1"    : req.body.observacoes1,
          "observacoes2"    : req.body.observacoes2,
          "observacoes3"    : req.body.observacoes3,
          "tipo"            : req.body.tipo 
         }   
   


     try{
      produtos =   await   select.buscaPorCodigo(dbName, produto.codigo  );

        if( produtos.length > 0 ){
          return res.status(200).json({erro: `ja existe um Produto cadastrado com o codigo: ${produto.codigo}` })
        }else{
            await insert.insert(dbName, produto);
          return res.status(200).json({
              ok:true,  
            msg: `produto cadastrado com sucesso   ${produto.codigo}` })

        }

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

 
   