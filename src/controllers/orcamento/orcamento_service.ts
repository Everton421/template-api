import { Response, Request } from "express";
import { SelectOrcamento } from "./selectOrcamento";
import { UpdateOrcamento } from "./updataOrcamento";
import { CreateOrcamento } from "./createOrcamento";

export class Orcamento_service {

    async cadastra(request: Request, response: Response) {
        const select = new SelectOrcamento();
        const update = new UpdateOrcamento();
        const create = new CreateOrcamento();

        function dataHora ( data:any  ) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');
            return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        }



        const dados_orcamentos = request.body;

        if (dados_orcamentos.length > 0) {
            // Usando Promise.all para aguardar todas as promessas
            const results = await Promise.all(dados_orcamentos.map(async (i:any) => {
                const aux: any = await select.validaOrcamento( i.codigo, i.vendedor );


                      if (aux.length > 0) {
                           const dataRecadastroSistema = dataHora(aux[0].DATA_RECAD);
                           console.log(`Orcamento ${i.codigo} encontrado, verificando atualizacao!`)

                          if(i.data_recadastro >  dataRecadastroSistema){
                           
                            try{
                               
                                await update.update(i, aux[0].CODIGO );
                                  console.log(`Orcamento ${i.codigo} atualizado com sucesso!`)
                                  return { codigo: aux[0].CODIGO,codigo_site: aux[0].COD_SITE, status: 'atualizado' };
                                }catch(e){ console.log("Erro ao atualizar orcamento ", i.codigo)} 
                                
                            }else{
                                    console.log(`Orcamento  ${i.codigo} nao teve atualizacao`)
                            }
                          } else {
                            
                            let dados:any;
                            let resultInsertOrder:any;

                            try{
                                  resultInsertOrder   = await create.create(i);
                                  return { codigo: resultInsertOrder  , codigo_site: i.codigo ,   status: 'inserido' };
                                
                                }catch(e){ console.log(`Erro ao gravar o orcamento`+ e)  }
                                

                            }
            }));

            // Responde após todos os orçamentos terem sido processados
            return response.status(200).json({ results });
        }else{
            return response.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });

        }

    }
///////
////////////////////////////
///////

    async selecionaPorData( request: Request, response: Response ){
        const select = new SelectOrcamento();
       
        let queryData:any = request.query.data;
        let vendedor = request.query.vendedor;

        const dados_orcamentos:any  = await select.buscaPordata( queryData, vendedor);

        let orcamentos_registrados:any=[];

        if( dados_orcamentos.length > 0 ){
      
        const promises  = dados_orcamentos.map( async ( i:any )=>{
            let produtos: any = [];
            let servicos: any = [];
            let parcelas: any = [];
                
                    try {
                        servicos = await select.buscaServicosDoOrcamento(i.orcamento);
                        if (servicos.length === 0 ) servicos = [];
                    } catch (error) {
                        console.log('erro ao buscar os servicos do orcamento ', i.orcamento);
                    }
                    try {
                        parcelas = await select.buscaParcelasDoOrcamento(i.orcamento);
                        if (parcelas.length === 0 ) parcelas = [];
                    } catch (error) {
                        console.log('erro ao buscar os servicos do orcamento ', i.orcamento);
                    }
                    try {
                        produtos = await  select.buscaProdutosDoOrcamento(i.orcamento);   
                       //if(produtos.length === 0 ) produtos = [];
 
                     } catch (error) {
                             console.log('erro ao buscar os produtos do orcamento ', i.orcamento );
                     }


                const descontos = ( i.desc_prod + i.desc_serv);
                const data_cadastro =  select.formatadataAtual(i.data_cadastro);
                const data_recadastro = select.dataHora(i.data_recadastro);

                let  data = {
                    "cliente": {
                        "codigo":  i.codigo_cliente,
                        "nome":  i.nome,
                        "cnpj": i.cnpj,
                        "celular": i.celular,
                             },
                    "codigo"               : i.orcamento,
                    "codigo_site"          : i.cod_site, 
                    "situacao"             : i.situacao,
                    "total_geral"          : i.total_geral,
                    "total_produtos"       : i.total_produtos,
                    "total_servicos"       : i.total_servicos,
                    "quantidade_parcelas"  : i.quantidade_parcelas,
                    "forma_pagamento"      : i.forma_pagamento,
                    "contato"              : i.contato,
                    "vendedor"             : i.vendedor,
                    "data_recadastro"      : data_recadastro,
                    "data_cadastro"        : data_cadastro,
                    "veiculo"              : i.veiculo,
                    "observacoes"          : i.observacoes,
                    "tipo_os"              : i.tipo_os,
                    "tipo"                 : i.tipo,
                    "descontos"            : descontos,
                    "produtos"             : produtos,
                    "parcelas"             : parcelas,
                    "servicos"             : servicos
                }
                 

                orcamentos_registrados.push(data);
            })
            await Promise.all(promises);
        }
//        console.log(produtos)
     
            return response.status(200).json(orcamentos_registrados);
    }

    async selecionaTodos( request: Request, response: Response ){
        const select = new SelectOrcamento();
    
            let dados = await select.buscaTodos();
            return response.status(200).json(dados);
    }





    async selecionaPorCodigo( request: Request, response: Response ){
        const select = new SelectOrcamento();
       
        let codigo:number | any = request.params.codigo;

        const dados_orcamentos:any  = await select.buscaPorCodigo(  codigo);

        let orcamento_registrado:any=[];

        if( dados_orcamentos.length > 0 ){
      
        const promises  = dados_orcamentos.map( async ( i:any )=>{
            let produtos: any = [];
            let servicos: any = [];
            let parcelas: any = [];
                
                    try {
                        servicos = await select.buscaServicosDoOrcamento(i.orcamento);
                        if (servicos.length === 0 ) servicos = [];
                    } catch (error) {
                        console.log('erro ao buscar os servicos do orcamento ', i.orcamento);
                    }
                    try {
                        parcelas = await select.buscaParcelasDoOrcamento(i.orcamento);
                        if (parcelas.length === 0 ) parcelas = [];
                    } catch (error) {
                        console.log('erro ao buscar os servicos do orcamento ', i.orcamento);
                    }
                    try {
                        produtos = await  select.buscaProdutosDoOrcamento(i.orcamento);   
                       //if(produtos.length === 0 ) produtos = [];
 
                     } catch (error) {
                             console.log('erro ao buscar os produtos do orcamento ', i.orcamento );
                     }


                const descontos = ( i.desc_prod + i.desc_serv);
                const data_cadastro =  select.formatadataAtual(i.data_cadastro);
                const data_recadastro = select.dataHora(i.data_recadastro);

                let  data = {
                    "cliente": {
                        "codigo":  i.codigo_cliente,
                        "nome":  i.nome,
                        "cnpj": i.cnpj,
                        "celular": i.celular,
                             },
                    "codigo"               : i.orcamento,
                    "codigo_site"          : i.cod_site, 
                    "situacao"             : i.situacao,
                    "total_geral"          : i.total_geral,
                    "total_produtos"       : i.total_produtos,
                    "total_servicos"       : i.total_servicos,
                    "quantidade_parcelas"  : i.quantidade_parcelas,
                    "forma_pagamento"      : i.forma_pagamento,
                    "contato"              : i.contato,
                    "vendedor"             : i.vendedor,
                    "data_recadastro"      : data_recadastro,
                    "data_cadastro"        : data_cadastro,
                    "veiculo"              : i.veiculo,
                    "observacoes"          : i.observacoes,
                    "tipo_os"              : i.tipo_os,
                    "tipo"                 : i.tipo,
                    "descontos"            : descontos,
                    "produtos"             : produtos,
                    "parcelas"             : parcelas,
                    "servicos"             : servicos
                }
                 

                orcamento_registrado = data
            })

            await Promise.all(promises);
        }
//        console.log(produtos)
     
            return response.status(200).json(orcamento_registrado);
    }





}
