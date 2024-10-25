import { Request, Response } from "express";
import { CreateOrcamento } from "../../models/pedido/insert";
import { SelectOrcamento } from "../../models/pedido/select";
import { UpdateOrcamento } from "../../models/pedido/update";

export class pedidoController{

    async insert( req:Request,res:Response){
        let insertPedido = new CreateOrcamento();
        let selectPedido = new SelectOrcamento();
        let updatePedido = new UpdateOrcamento();
   //     console.log(req.body);
   //     console.log(req.headers);

        if(!req.headers.cnpj) return  res.status(400).json({erro:"É necessario informar o codigo da empresa "})

        let cnpj = `\`${req.headers.cnpj}\``;

        if( req.body.length < 0 ) return   res.status(400).json({erro:"É necessario informar os pedidos! "})


            if( req.body.length > 0  ){

                    let dadosPedidos = req.body;

            const results = await Promise.all(dadosPedidos.map(async (p:any) => {

                    let validPedido:any;
                    let status_registrado:any;  
                             
                    validPedido = await selectPedido.validaExistencia( cnpj, p.codigo)

                            if( validPedido.length > 0  ){

                                let pedidoEncontrado = validPedido[0]; 
                                         if ( p.data_recadastro >  pedidoEncontrado.data_recadastro){
                                              let aux = await updatePedido.update(cnpj, p, p.codigo)
                                             console.log( aux)
                                             return { codigo: aux , status: 'atualizado' };
                                         } else{
                                            console.log(` o pedido ${p.codigo} se encontra atualizado com sucesso` )
                                            return { codigo: p.codigo , status: ` O pedido ${p.codigo} se encontra atualizado` };
                                         }

                                } else{
                                    console.log(`registrando pedido      `)
                                     status_registrado = await insertPedido.create(cnpj, p)

                                  return { codigo: p.codigo , status: 'inserido' };

                                }
                
                            }))
                            return res.status(200).json({ results });

                }else{
            return res.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });
                }

    }






async select( req:Request,res:Response){
 
  if(!req.query.data)  return res.status(400).json({erro:`é necessario informar uma data`});
    if(!req.query.vendedor)  return res.status(400).json({erro:`é necessario informar o vendedor`});
    if(!req.headers.cnpj) return  res.status(400).json({erro:"É necessario informar o codigo da empresa "})

    let cnpj = `\`${req.headers.cnpj}\``;
    let vendedor = Number(req.query.vendedor);
    let data = req.query.data

    let selectOrcamento = new SelectOrcamento();
    let insertOrcamento = new CreateOrcamento();
    let updateOrcamento = new UpdateOrcamento();


    let orcamentos_registrados:any=[];


    const dados_orcamentos:any  = await selectOrcamento.buscaPordata(  cnpj, data, vendedor  );
    if( dados_orcamentos.length > 0 ){

        const promises  = dados_orcamentos.map( async ( i:any )=>{
                let produtos: any = [];
                let servicos: any = [];
                let parcelas: any = [];

                try{
                    produtos = await updateOrcamento.buscaProdutosDoOrcamento(cnpj, i.codigo);
                    if( produtos.length === 0 ) produtos=[];
                }catch(e){ console.log(`erro ao buscar os produtos do pedido ${i.codigo}`)}
                
                try{
                    servicos = await updateOrcamento.buscaServicosDoOrcamento(cnpj, i.codigo);
                    if( servicos.length === 0 ) servicos=[];
                }catch(e){ console.log(`erro ao buscar os servicos do pedido ${i.codigo}`)}
                
                try{
                    parcelas = await updateOrcamento.buscaParcelasDoOrcamento(cnpj, i.codigo);
                    if( parcelas.length === 0 ) parcelas=[];
                }catch(e){ console.log(`erro ao buscar as parcelas do pedido ${i.codigo}`)}
            
                i.produtos = produtos;
                i.servicos = servicos;
                i.parcelas = parcelas;
                
                console
                orcamentos_registrados.push(i);
        
            })
            await Promise.all(promises);

            console.log(orcamentos_registrados)
        }
        return res.status(200).json(orcamentos_registrados);

    }

}