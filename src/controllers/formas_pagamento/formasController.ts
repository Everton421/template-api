import { Request, Response } from "express";
import { SelectForma_pagamento } from "../../models/formas_pagamento/select";
import { Insert_formaPagamento } from "../../models/formas_pagamento/insert";

export class FormasController{
  obterDataAtual() {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    return `${ano}-${mes}-${dia}`;
}
   obterDataHoraAtual() {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const hora = dataAtual.getHours();
    const minuto = dataAtual.getMinutes();
    const segundos = dataAtual.getSeconds();
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundos}`;
}


    async buscaGeral(req:Request,res:Response){
      let empresa   = req.headers.cnpj 
      let select = new  SelectForma_pagamento();
  
       if(!empresa){
          return res.json(200).json({erro:"É necessario informar a empresa "});   
       } 
       let headerCnpj:any =   String(req.headers.cnpj) ;
       let cnpjF = headerCnpj.replace(/\D/g, '');
       let dbName  = `\`${cnpjF}\``;

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

    async cadastrar(req:Request,res:Response){
      let empresa   = req.headers.cnpj 
      let select = new  SelectForma_pagamento();
      let insert = new Insert_formaPagamento();
      let obj = new FormasController()
       if(!empresa){
          return res.json(200).json({erro:"É necessario informar a empresa "});   
       } 
  
       let headerCnpj:any =   String(req.headers.cnpj) ;

       let cnpjF = headerCnpj.replace(/\D/g, '');
       let dbName  = `\`${cnpjF}\``;
       
       if(!req.body.data.id) req.body.data.id = 0; 
       if(!req.body.data.descricao)  return res.status(200).json({erro:"É necessario informar a descrição para gravar "});  
       if(!req.body.data.desc_maximo) req.body.data.desc_maximo = 0;  
       if(!req.body.data.parcelas) return res.status(200).json({erro:"É necessario informar a quantidade de parcelas para gravar"});  
       if(!req.body.data.intervalo) req.body.data.intervalo = 0;  
       if(!req.body.data.recebimento) req.body.data.recebimento = 0;   
       if(!req.body.data.data_cadastro) req.body.data.data_cadastro =  obj.obterDataAtual(); 
       if(!req.body.data.data_recadastro) req.body.data.data_recadastro = obj.obterDataHoraAtual();         
      
    try{
        let aux:any = await insert.cadastrar(dbName, req.body.data)
         if(aux.insertId > 0 ){
           req.body.data.codigo = aux.insertId 
          
           return res.status(200).json({ 
               codigo:   req.body.data.codigo,
               id: req.body.data.id,
               descricao: req.body.data.descricao,
               desc_maximo: req.body.data.desc_maximo,
               parcelas: req.body.data.parcelas,
               intervalo: req.body.data.intervalo,
               recebimento: req.body.data.recebimento,
               data_cadastro: req.body.data.data_cadastro,
               data_recadastro: req.body.data.data_recadastro
             });
         }
      }catch(e){ console.log(e)}
    
      }


  
  
  
}  