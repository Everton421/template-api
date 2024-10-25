import { Request, Response } from "express";
import { Select_clientes } from "../../models/cliente/select";

export class ClienteController{

    async buscaGeral( req:Request,res:Response  ){
        let empresa   = req.headers.cnpj 
        let cnpj = `\`${req.headers.cnpj}\``;
        
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
            let clientes = await select.buscaGeral(cnpj, queryVendedor);

            if (clientes.length === 0) {
                return res.status(404).json({ erro: "Nenhum cliente encontrado." });
              }
              return res.status(200).json(clientes);

        }catch(e ) { 
            console.error(e)
            return res.status(500).json({ erro: "Erro ao buscar clientes." });
        }
    }
}



 
