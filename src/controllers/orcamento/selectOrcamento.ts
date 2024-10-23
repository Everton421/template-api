import { Request, Response, request, response } from "express";
import { conn, db_vendas, db_estoque, db_publico } from "../../database/databaseConfig";



export class SelectOrcamento{



      
       formatarData(data: string): string | null {
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!regex.test(data)) {
            return null;
        }
        return data;
    }

      obterDataAtualSemHoras() {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();
        return `${ano}-${mes}-${dia} 00-00-00`;
    }

      dataHora ( data:any  ) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }

       formatadataAtual ( data:any   ) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }
    



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

    async validaOrcamento( codigo: any, vendedor:number ) {
        return new Promise(async (resolve, reject) => {

            const code = parseInt(codigo)

            const sql = ` select * from ${db_vendas}.cad_orca where COD_SITE = ${code} and vendedor = ${vendedor} `
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
     

    async buscaOrcamentoCod_site( codigo: any, vendedor:number ) {
        return new Promise(async (resolve, reject) => {

            const code = parseInt(codigo)

            const sql = ` select codigo from ${db_vendas}.cad_orca where COD_SITE = ${code} and vendedor = ${vendedor} `
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
     
    async   buscaProdutosDoOrcamento(codigo_orcamento: any) {
        let sql  = `
                 select 
                  po.orcamento pedido , 
                  po.produto codigo,
                  cp.descricao,
                  po.fator_qtde as quantidade,
                  po.unitario as preco,
                  po.desconto,
                  po.total_liq as total  
                      from ${db_vendas}.pro_orca po
                     left join ${db_publico}.cad_prod cp on cp.codigo = po.produto
                      where po.orcamento = ${codigo_orcamento} ;`

            return new Promise( async (resolve, reject) => {
               await conn.query(sql , (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
    }
 

    async  buscaServicosDoOrcamento(codigo_orcamento: any) {
        let sql = `
                         select  
                         cs.codigo, so.orcamento pedido, 
                         cs.aplicacao ,so.quantidade ,
                          so.desconto, so.unitario valor,
                            ( (so.quantidade * so.unitario) - desconto ) as total 
                              from ${db_vendas}.ser_orca so 
                              join ${db_publico}.cad_serv cs 
                              on cs.codigo = so.servico
                              where so.orcamento = ?  ;`

        return new Promise( async (resolve, reject) => {

            await conn.query(sql, [codigo_orcamento], (err, result) => {
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

    async  buscaParcelasDoOrcamento(codigo_orcamento: any) {
        let sql = `
                         select   orcamento pedido, parcela, valor, DATE_FORMAT(vencimento, '%Y-%m-%d') as vencimento    from ${db_vendas}.par_orca where orcamento = ?  ;`

        return new Promise( async (resolve, reject) => {

           await conn.query(sql, [codigo_orcamento], (err, result) => {
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


    async buscaPordata( queryData:any, vendedor:any ) {
        
        function formatarData(data: string): string | null {
            const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            if (!regex.test(data)) {
                return null;
            }
            return data;
        }

        function obterDataAtualSemHoras() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia} 00-00-00`;
        }

        function dataHora ( data:any  ) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');
            return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        }
    
        function  formatadataAtual ( data:any   ) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');
            return `${ano}-${mes}-${dia}`;
        }
        
        let param_data;
    
        if (!vendedor) {
            return response.status(400).json({ "erro": "É necessário informar o vendedor!" });
        }
        
        if (!queryData) {
            param_data = obterDataAtualSemHoras();
        } else {
            param_data = formatarData(queryData);
            if (!param_data) {
                return response.status(400).json({ "erro": "Data deve estar no formato YYYY-MM-DD HH-MM-SS!" });
            }
        }


        const sql = ` SELECT 
               co.codigo as orcamento,
               co.cod_site,
               co.total_geral,
               cli.codigo as codigo_cliente,
               co.forma_pagamento,
               co.contato,
               co.situacao,
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
                           left join ${db_publico}.cad_clie cli on cli.codigo = co.cliente
                            where co.data_recad  >= '${param_data}' and co.vendedor = ${vendedor}
                            ;
                        `;

      return new Promise( async ( resolve, reject )=>{

        await conn.query(sql,   async (err, result) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
           resolve(result)
            }
        })
    }) 

    }


    async buscaTodos(  ) {

        const sql = ` SELECT 
               co.codigo as orcamento,
               co.cod_site,
               co.total_geral,
               cli.codigo as codigo_cliente,
               co.forma_pagamento,
               co.contato,
               co.situacao,
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
                           left join ${db_publico}.cad_clie cli on cli.codigo = co.cliente
                            ;
                        `;

      return new Promise( async ( resolve, reject )=>{

        await conn.query(sql,   async (err, result) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
           resolve(result)
            }
        })
    }) 

    }


    async buscaPorCodigo(codigo:number  ) {

        const sql = ` SELECT 
    co.codigo as orcamento,
    co.cod_site,
    co.total_geral,
    cli.codigo as codigo_cliente,
    co.forma_pagamento,
    co.contato,
    co.situacao,
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
                left join ${db_publico}.cad_clie cli on cli.codigo = co.cliente
                where co. codigo = ${codigo}
                        `;

      return new Promise( async ( resolve, reject )=>{

        await conn.query(sql,   async (err, result) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
             //   console.log(result)
           resolve(result)
            }
        })
    }) 

    }

    

}