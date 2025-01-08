import { Request, Response } from "express";
import { Select_produtos } from "../../models/produtos/select";
import { Produto } from "../../models/produtos/interface_produto";
import { InsertProdutos } from "../../models/produtos/insert";
import { conn } from "../../database/databaseConfig";

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
 

   
 function  obterDataAtual() {
  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const ano = dataAtual.getFullYear();
  return `${ano}-${mes}-${dia}`;
}

 function  obterDataHoraAtual() {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const hora = dataAtual.getHours();
    const minuto = dataAtual.getMinutes();
    const segundos = dataAtual.getSeconds();
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundos}`;
}

        if(!req.body.id)    req.body.id = 0 
        if(!req.body.preco)    req.body.preco = 0 
        if(!req.body.estoque)    req.body.estoque = 0 

        if(!req.body.grupo)             return res.status(200).json({ erro:true, msg: "É necessario informar o grupo para registrar o produto!"});
        if(!req.body.descricao)         return res.status(200).json({ erro:true, msg: "É necessario informar a descrição para registrar o produto!"});
        if(!req.body.num_fabricante)   req.body.num_fabricante =''  //return res.status(200).json({ erro:true, msg: "É necessario informar o codigo de barras para registrar o produto!"});
        if(!req.body.num_original)     req.body.num_original =''  //return res.status(200).json({ erro:true, msg: "É necessario informar a referência  para registrar o produto!"});
        
        if(!req.body.origem) req.body.origem = 0;     
        if(!req.body.sku)              req.body.sku =''  //return res.status(200).json({ erro:true, msg: "É necessario informar o sku  para registrar o produto!"});
        if (!req.body.ativo)   req.body.ativo = 'S'     // return res.status(200).json({ erro:true, msg: "É necessario informar o status do produto !"});
        if (!req.body.class_fiscal) req.body.class_fiscal= '0000.00.00'    //return res.status(200).json({ erro:true, msg: "É necessario informar o ncm  para registrar o produto!"});
        if (!req.body.cst) req.body.cst='00'   //return res.status(200).json({ erro:true, msg: "É necessario informar  cst para registrar o produto!"});
        if(!req.body.tipo) req.body.tipo = 0
        if(!req.body.data_cadastro ) req.body.data_cadastro = obterDataAtual(); 
        if(!req.body.data_recadastro ) req.body.data_recadastro = obterDataHoraAtual();

        if(!req.body.observacoes1) req.body.observacoes1 =  ""
        if(!req.body.observacoes2) req.body.observacoes2 = "" 
        if(!req.body.observacoes3) req.body.observacoes3 = "" 

        let produto =  {
          "codigo"          : req.body.codigo,
          "id"              : req.body.id,
          "estoque"         : req.body.estoque,
          "preco"           : req.body.preco,
          "grupo"           : req.body.grupo,
          "origem"          : req.body.origem,
          "descricao"       : req.body.descricao,
          "num_fabricante"  : req.body.num_fabricante, // num-fabricante gtim/codigo de barros 
          "num_original"    : req.body.num_original,   //referencia 
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
          let resultinsertId:any = await insert.insert(dbName, produto);
            return res.status(200).json(
              {
              "codigo": resultinsertId.insertId,
              "id"              : req.body.id,
              "estoque"         : req.body.estoque,
              "preco"           : req.body.preco,
              "grupo"           : req.body.grupo,
              "origem"          : req.body.origem,
              "descricao"       : req.body.descricao,
              "num_fabricante"  : req.body.num_fabricante, // num-fabricante gtim/codigo de barros 
              "num_original"    : req.body.num_original,   //referencia 
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
            })
           
            
        }catch(e){
          return res.status(200).json({ erro:true, msg: `Ocorreu um erro ao cadastrar o produto!`});

         }

 
}


}

 
   