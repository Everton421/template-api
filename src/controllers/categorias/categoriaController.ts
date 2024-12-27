import { Request, Response } from "express";
import { Select_clientes } from "../../models/cliente/select";
import { Insert_clientes } from "../../models/cliente/insert";
import { Cliente } from "../../models/cliente/interface_cliente";  
import { Select_Categorias } from "../../models/categorias/select";
import { Insert_Categorias } from "../../models/categorias/insert";

export class CategoriaController{

    formatarDataEhora(data: string): string | null {
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!regex.test(data)) {
            return null;
          }
         return data;
         }
           formatarData(data:any) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
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

 
    async buscaGeral( req:Request,res:Response  ){
        let empresa:any   = req.headers.cnpj 
 
        let select = new Select_Categorias();
        let insert = new Insert_Categorias();

        if(!req.headers.cnpj ){
            return res.status(200).json({erro:true, msg:"É necessario informar a empresa "});   
         } 
           
         let headerCnpj:any  = empresa.replace(/\D/g, '');
    
         let  dbName = `\`${headerCnpj}\``;
         
         try{

                let resultado:any = await select.busca_geral(dbName);
                if( resultado.length > 0 ){
                    return res.status(200).json(resultado)
                }

         }catch(e){
            console.log("ocorreu um erro ao consultar as categorias", e)
        return res.status(200).json({erro:true, msg:"ocorreu um erro ao consultar as categorias"})

         }
       
    
    }
    
    async buscaPorDescricao(req:Request,res:Response){
        let empresa:any   = req.headers.cnpj 
 
        let select = new Select_Categorias();
        let insert = new Insert_Categorias();

        if(!req.headers.cnpj ){
            return res.status(200).json({erro:true, msg:"É necessario informar a empresa "});   
         } 
         
          let headerCnpj:any  = empresa.replace(/\D/g, '');
         let descricao = req.params.descricao

         let  dbName = `\`${headerCnpj}\``;
         
         try{

                let resultado:any = await select.busca_por_descricao( dbName,descricao );
 
                    return res.status(200).json(resultado)
         
         }catch(e){
            console.log("ocorreu um erro ao consultar as categorias", e)
        return res.status(200).json({erro:true, msg:"ocorreu um erro ao consultar as categorias"})

         }
     }

async cadastrar(req:Request,res:Response){
    let obj = new CategoriaController();
    let cnpj:any   = req.headers.cnpj 
 
    let select = new Select_Categorias();
    let insert = new Insert_Categorias();
 
            let postCategoria:any = req.body; 
           
             let  empresa = `\`${cnpj}\``;
          
            if(!postCategoria.id)  postCategoria.id =  "0";
            if(!postCategoria.descricao)  return res.status(200).json( { erro:true, msg:`E necessario informar a descricao da categoria!`}) 
            if(!postCategoria.data_cadastro ) postCategoria.data_cadastro = obj.obterDataAtual();
            if(!postCategoria.data_recadastro ) postCategoria.data_recadastro = obj.obterDataHoraAtual();
 
              let validCategor:any = await select.busca_por_descricao( empresa, postCategoria.descricao )
    
        if( validCategor.length > 0  )  return  res.status(200).json({ erro:true, msg:`A categoria ${postCategoria.descricao} ja foi cadastrada!`})
           
             let responseCategoria:any;
                     try{    
                           responseCategoria = await insert.cadastrar(empresa, postCategoria)
                    
                         if( responseCategoria.insertId > 0 ){
                             return res.status(200).json({ 
                                  "codigo":responseCategoria.insertId,
                                  "descricao":postCategoria.descricao,
                                  "data_cadastro":postCategoria.data_cadastro,
                                  "data_recadastro":postCategoria.data_recadastro,
                                 })
                         }
                     }catch(e){
                             console.log(e);
                             return res.status(200).json({erro:"ocorreu um erro ao tentar registrar a categoria"})
                     }

        }
	
        

}



 
