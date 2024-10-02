import { Request, Response, request, response } from "express";
import { conn, db_vendas, db_estoque, db_publico } from "../../database/databaseConfig";



export class SelectOrcamento{
    async buscaOrcamentosDoDia(request: Request, response: Response) {

        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }

        let aux = obterDataAtual();
        let filtro;
        let parametros: any;

        let vend:any = request.query.vendedor
        let vendedor:number = parseInt( aux );
        let parametro: any = request.query.parametro;

        if (!vendedor || vendedor === undefined) {
            vendedor = 0
        }
        //  console.log(vendedor);

        if (parametro !== '*') {
            filtro = `( cli.nome LIKE ? or co.codigo like ? ) AND co.vendedor = ${vendedor} `;
            parametros = [`%${parametro}%`, `%${parametro}%`, vendedor];
        } else {
            // busca os dadso com a data de hj, caso nao tenha sido passado nenhum parametro
            filtro = `co.data_cadastro LIKE ? and co.vendedor = ${vendedor}`;
            parametros = [`%${aux}%`];
        }

        const sql = `
        SELECT co.codigo, co.total_geral, cli.nome, co.data_cadastro, co.situacao, co.vendedor,co.tipo, 
         DATE_FORMAT( co.data_cadastro, '%Y-%m-%d') as data_cadastro
        FROM ${db_vendas}.cad_orca co
        JOIN ${db_publico}.cad_clie cli ON cli.codigo = co.cliente
        WHERE ${filtro};
    `;
        console.log(sql);

        return new Promise(async (resolve, reject) => {
            await conn.query(sql, parametros, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    // console.log(result);
                    if (result.length > 0) {
                        resolve(response.json(result));
                    } else {
                        return response.status(500).json("nenhum Orçamento encontrado")
                    }
                }
            })

        })

    }

    async validaOrcamento( codigo: number, vendedor:number ) {
        return new Promise(async (resolve, reject) => {

            const sql = ` select * from ${db_vendas}.cad_orca where COD_SITE = ${codigo} and vendedor = ${vendedor} `
            conn.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    // console.log(result)
                    resolve(result);
                }
            })

        })
    }
     

    async buscaPordata(request: Request, response: Response) {
       
        
        function obterDataAtualSemHoras() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia} 00-00-00`;
        }
        
        function obterDataHora(data) {
            // Converte a string no formato "YYYY-MM-DD HH-MM-SS" para um objeto Date
            const partes = data.split(' ');
            const dataParte = partes[0].split('-');
            const horaParte = partes[1].split('-');
        
            const ano = parseInt(dataParte[0], 10);
            const mes = parseInt(dataParte[1], 10) - 1; // Mês começa em 0
            const dia = parseInt(dataParte[2], 10);
            const hora = parseInt(horaParte[0], 10);
            const minutos = parseInt(horaParte[1], 10);
            const segundos = parseInt(horaParte[2], 10);
        
            const dataObj = new Date(ano, mes, dia, hora, minutos, segundos);
            return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')} ${String(hora).padStart(2, '0')}-${String(minutos).padStart(2, '0')}-${String(segundos).padStart(2, '0')}`;
        }
        function obterData (data) {
            // Converte a string no formato "YYYY-MM-DD HH-MM-SS" para um objeto Date
            const partes = data.split(' ');
            const dataParte = partes[0].split('-');
            const horaParte = partes[1].split('-');
        
            const ano = parseInt(dataParte[0], 10);
            const mes = parseInt(dataParte[1], 10) - 1; // Mês começa em 0
            const dia = parseInt(dataParte[2], 10);
            const hora = parseInt(horaParte[0], 10);
            const minutos = parseInt(horaParte[1], 10);
            const segundos = parseInt(horaParte[2], 10);
        
            const dataObj = new Date(ano, mes, dia, hora, minutos, segundos);
            return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        }

        let vendedor = request.query.vendedor;
        
        let param_data;
        
            if(!vendedor){
                return response.status(400).json({"erro":"É necessario informar o vendedor!"})
            }

        if (!request.query.data) {
            param_data = obterDataAtualSemHoras();
        } else {
            const dataConsulta = request.query.data;
            param_data = obterDataHora(dataConsulta);
        }


        let dados: any;
        let produtosOrcamento: any = [];



        async function buscaProdutosDoOrcamento(codigo_orcamento: any) {
            let sql = `
                             select 
                              po.orcamento pedido , 
                              po.produto codigo,
                              cp.descricao,
                              po.fator_qtde as quantidade,
                              po.unitario as preco,
                              po.desconto,
                              po.total_liq as total  
                                  from ${db_vendas}.pro_orca po
                                  join ${db_publico}.cad_prod cp on cp.codigo = po.produto
                                  where orcamento = ?  ;`

            return new Promise((resolve, reject) => {

                conn.query(sql, [codigo_orcamento], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                        // console.log(result);
                    }
                })
            })
        }

        
        async function servicosDoOrcamento(codigo_orcamento: any) {
            let sql = `
                             select   so.orcamento pedido, cs.aplicacao ,so.quantidade , so.desconto, so.unitario valor 
                                  from ${db_vendas}.ser_orca so 
                                  join ${db_publico}.cad_serv cs 
                                  on cs.codigo = so.servico
                                  where so.orcamento = ?  ;`

            return new Promise((resolve, reject) => {

                conn.query(sql, [codigo_orcamento], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                        // console.log(result);
                    }
                })
            })
        }

        async function parcelasDoOrcamento(codigo_orcamento: any) {
            let sql = `
                             select   orcamento pedido, parcela, valor, DATE_FORMAT(vencimento, '%Y-%m-%d') as vencimento    from ${db_vendas}.par_orca where orcamento = ?  ;`

            return new Promise((resolve, reject) => {

                conn.query(sql, [codigo_orcamento], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                        // console.log(result);
                    }
                })
            })
        }



        const sql = ` SELECT 
               co.codigo as orcamento,
               co.tipo,  
               co.total_geral,
               cli.codigo as codigo_cliente,
               co.forma_pagamento,
               co.contato,
               cli.nome , 
                cli.cpf cnpj,
                cli.celular celular,
               co.qtde_parcelas quantidade_parcelas, 
               co.total_produtos total_produtos,
               co.total_servicos total_servicos,
               cli.nome,
               co.data_cadastro,
               co.vendedor,
               co.data_recad data_recadastro,
              CAST( co.observacoes AS char ) observacoes ,
               co.desc_serv,
               co.desc_prod ,
               co.veiculo veiculo,
               co.tipo_os,
               co.tipo
             from ${db_vendas}.cad_orca co
                            join ${db_publico}.cad_clie cli on cli.codigo = co.cliente
                            where co.data_recad  >= '${param_data}' and co.vendedor = ${vendedor}
                            ;
                        `;
         //  console.log(sql)
        //  console.log('')
        //  console.log('')
        //  console.log('')

        await conn.query(sql,   async (err, result) => {
            if (err) {
                console.log(err);
            } else {


                let produtos: any;
                let parcelas: any;
                let servicos: any;

                let dados_orcamentos:any[] = [] ;
            
               
                 
                if (result.length > 0) {
                    
                   const promises  =  result.map( async ( i ) =>{
                        
                  
                    
                    try {
                            produtos = await buscaProdutosDoOrcamento(i.orcamento);
                        } catch (erro) {
                            console.log(`erro ao buscar produtos ${erro}`)
                        }
        
                        try {
                            parcelas = await parcelasDoOrcamento(i.orcamento);
                        } catch (erro) {
                            console.log(`erro ao buscar produtos ${erro}`)
                        }
                      
                        try {
                            servicos = await servicosDoOrcamento(i.orcamento);
                        } catch (erro) {
                            console.log(`erro ao buscar servicos ${erro}`)
                        }
                        if (produtos.length === 0) {
                            produtos = [];
                        }
        
                        if (parcelas.length === 0) {
                            parcelas = [];
                        }
                        if (servicos.length === 0) {
                            servicos = [];
                        }
                        
                            const descontos = ( i.desc_prod + i.desc_serv);
                            const data_cadastro = obterData(i.data_cadastro);
                            const data_recadastro = obterDataHora(i.data_recadastro);

                           let  data = {
                            "cliente": {
                                "codigo":  i.codigo_cliente,
                                "nome":  i.nome,
                                "cnpj": i.cnpj,
                                "celular": i.celular,
                            },
                         "codigo"               : i.orcamento,
                         "total_geral"          : i.total_geral,
                         "total_produtos"       : i.total_produtos,
                         "total_servicos"       : i.total_servicos,
                         "quantidade_parcelas"  : i.quantidade_parcelas,
                         "forma_pagamento"      : i.forma_pagamento,
                         "contato"              : i.contato,
                         "vendedor"             : i.vendedor,
                         "data_recadastro"      : i.data_recadastro,
                         "data_cadastro"        : i.data_cadastro,
                         "veiculo"              : i.veiculo,
                         "observacoes"          : i.observacoes,
                         "tipo_os"              : i.tipo_os,
                         "tipo"                 : tipo,
                         "descontos"            : descontos,
                         "produtos"             : produtos,
                         "parcelas"             : parcelas,
                         "servicos"             : servicos

                     }


                     dados_orcamentos.push(data);

                    })
                    await Promise.all(promises);
                }

   
        
                response.json(dados_orcamentos)
            }

        })

 


    }


}