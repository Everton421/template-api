import { Request, Response } from "express";
import { CreateOrcamento } from "../../models/pedido/insert";
import { SelectOrcamento } from "../../models/pedido/select";
import { UpdateOrcamento } from "../../models/pedido/update";
import { Select_clientes } from "../../models/cliente/select";

export class pedidoController{

      formatarData(data:any) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${ano}-${mes}-${dia}`;
    }
    

      formatarDataHora(data:any) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        const segundo = String(data.getSeconds()).padStart(2, '0');
        return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    }
    


    async insert( req:Request,res:Response){

        let controller = new pedidoController();
        let insertPedido = new CreateOrcamento();
        let selectPedido = new SelectOrcamento();
        let updatePedido = new UpdateOrcamento();
   //     console.log(req.body);
   //     console.log(req.headers);

        if(!req.headers.cnpj) return  res.status(200).json({erro:"É necessario informar o codigo da empresa "})

        let cnpj = `\`${req.headers.cnpj}\``;

        if( req.body.length < 0 ) return   res.status(200).json({erro:"É necessario informar os pedidos! "})


            if( req.body.length > 0  ){

                    let dadosPedidos = req.body;

            const results = await Promise.all(dadosPedidos.map(async (p:any) => {

                    console.log(p)
                    let validPedido:any;
                    let status_registrado:any;  
                             
                    validPedido = await selectPedido.validaExistencia( cnpj, p.codigo)

                            if( validPedido.length > 0  ){

                                let pedidoEncontrado = validPedido[0]; 
                                    let data_recad = controller.formatarDataHora(pedidoEncontrado.data_recadastro)

                                         if ( p.data_recadastro >  data_recad){
                                              let aux = await updatePedido.update(cnpj, p, p.codigo)
                                            // console.log( aux)
                                             return { codigo: aux , status: 'atualizado' };
                                         } else{
                                            console.log(` o pedido ${p.codigo} se encontra atualizado com sucesso` )
                                            return { codigo: p.codigo , status: ` O pedido ${p.codigo} se encontra atualizado` };
                                         }

                                } else{
                                    console.log(`registrando pedido      ${p}`)
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
 
    let controller = new pedidoController();

  if(!req.query.data)  return res.status(400).json({erro:`é necessario informar uma data`});
    if(!req.query.vendedor)  return res.status(400).json({erro:`é necessario informar o vendedor`});
    if(!req.headers.cnpj) return  res.status(400).json({erro:"É necessario informar o codigo da empresa "})

    let cnpj = `\`${req.headers.cnpj}\``;
    let vendedor = Number(req.query.vendedor);
    let data = req.query.data

    let selectOrcamento = new SelectOrcamento();
    let insertOrcamento = new CreateOrcamento();
    let updateOrcamento = new UpdateOrcamento();
    let select_clientes = new Select_clientes();

    let orcamentos_registrados:any=[];


    const dados_orcamentos:any  = await selectOrcamento.buscaPordata(  cnpj, data, vendedor  );
    if( dados_orcamentos.length > 0 ){

        const promises  = dados_orcamentos.map( async ( i:any )=>{
                let produtos: any = [];
                let servicos: any = [];
                let parcelas: any = [];
                let cliente:any;
                
                    i.data_recadastro = controller.formatarDataHora(i.data_recadastro);
                    i.data_cadastro = controller.formatarData(i.data_cadastro);


                try{
                   let resultCliente = await select_clientes.buscaPorcodigo(cnpj, i.cliente);
                    if( resultCliente.length === 0 ) { 
                        cliente={}; } else{
                            cliente = resultCliente[0] 
                        }
                }catch(e){ console.log(`erro ao buscar os produtos do pedido ${i.codigo}`)}
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
                i.cliente = cliente
                console
                orcamentos_registrados.push(i);
        
            })
            await Promise.all(promises);

            console.log(orcamentos_registrados)
        }
        return res.status(200).json(orcamentos_registrados);

    }

}