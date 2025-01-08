import { Request, Response } from "express";
import { Select_clientes } from "../../models/cliente/select";
import { Insert_clientes } from "../../models/cliente/insert";
import { Cliente } from "../../models/cliente/interface_cliente";  

export class ClienteController{

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

        if(!req.headers.cnpj ){
            return res.status(200).json({erro:"É necessario informar a empresa "});   
         } 
           
         let headerCnpj:any  = empresa.replace(/\D/g, '');
    
         let  dbName = `\`${headerCnpj}\``;
    
        
        const queryVendedor = req.query.vendedor;

        let vendedor = req.query
        if(!empresa){
            return res.json(400).json({erro:"É necessario informar a empresa "});   
         } 
         if(!queryVendedor){
            return res.json(400).json({erro:"É necessario informar a o vendedor  "});   
         } 
         
     
        let select = new Select_clientes();
        try{
            let clientes = await select.buscaGeral(dbName, queryVendedor);

            if (clientes.length === 0) {
                return res.status(404).json({ erro: "Nenhum cliente encontrado." });
              }
              return res.status(200).json(clientes);

        }catch(e ) { 
            console.error(e)
            return res.status(500).json({ erro: "Erro ao buscar clientes." });
        }
    }




async cadastrar(req:Request,res:Response){
    let obj = new ClienteController();
    let empresa:any   = req.headers.cnpj 
    let select = new Select_clientes();
    let insert = new Insert_clientes();


    if(!req.headers.cnpj ){
        return res.status(200).json({erro:true,msg:"É necessario informar a empresa "});   
     } 
     let headerCnpj:any  = empresa.replace(/\D/g, '');
     let  dbName = `\`${headerCnpj}\``;

            let vCnpj = req.body.cnpj;
            let postCliente:Cliente = req.body; 
            let cnpjFormat;

            if(!postCliente.id)               postCliente.id =  "0";
            if (!postCliente.celular)         postCliente.celular = "(00) 0000-0000";
            if (!postCliente.nome)            postCliente.nome = "teste";
            if (!postCliente.cep)             postCliente.cep = "00000-000";
            if (!postCliente.endereco)        postCliente.endereco = "";
            if (!postCliente.ie)              postCliente.ie = "";
            if (!postCliente.numero)          postCliente.numero = "";
            if (!postCliente.cnpj)            return res.status(200).json({erro:true, msg:" é necessario informar o cnpj/cpf do cliente"});            
            if (!postCliente.cidade)          postCliente.cidade = "";
          
            if (!postCliente.data_cadastro || postCliente.data_cadastro ===  "0000-00-00") {
                postCliente.data_cadastro = obj.obterDataAtual();
            }else{
                postCliente.data_cadastro = obj.formatarData(postCliente.data_cadastro);
            }
          
            if (!postCliente.data_recadastro || postCliente.data_recadastro === "0000-00-00 00:00:00" ){ 
                     postCliente.data_recadastro = obj.obterDataHoraAtual()
                } else{
                     postCliente.data_recadastro = obj.formatarDataEhora(postCliente.data_recadastro ) 
                 };
          
            if (!postCliente.vendedor)        postCliente.vendedor = 0;
            if (!postCliente.bairro)          postCliente.bairro = "";
            if (!postCliente.estado)          postCliente.estado = "";

        if(vCnpj.length < 11 || vCnpj.length > 14 ||   vCnpj.length === 12 || vCnpj.length === 13 ) {
            return res.status(200).json({erro:true, msg:"cnpj/cpf invalido  "});   
        }

        if( vCnpj.length === 14 ){
            cnpjFormat =  vCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'); 
        }
        if(vCnpj.length === 11 ){
            cnpjFormat =  vCnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4'); 
        }

            let validCnpj = await select.buscaPorCnpj(dbName,cnpjFormat);

            if( validCnpj.length > 0 ){
                    return res.status(200).json({erro:true, msg:"já existe cliente cadastrado com este cnpj/cpf"});        
            }else{
                let resultId = await select.buscaUltimoIdInserido(dbName);
                let ultimoId =resultId[0].codigo; 
                let novoCod = ultimoId + 1;
                let itemInserido;
                     postCliente.codigo = novoCod;
                        try{
                            itemInserido = await insert.cadastrar(dbName,postCliente )
                            console.log(itemInserido)
                            return res.status(200).json({ok:true, msg:"cliente cadastrado com sucesso!"});        

                        }catch(err){
                                console.log(`erro ao inserir o cliente`,err);
                    return res.status(200).json({erro:true, msg:"erro ao inserir o cliente"});        

                        }   
            }
        }
	
        

}



 
