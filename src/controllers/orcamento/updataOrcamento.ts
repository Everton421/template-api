import { Request, Response, request, response } from "express";
import { conn, db_vendas, db_estoque, db_publico } from "../../database/databaseConfig";


export class UpdateOrcamento{
    async update(orcamento:any) {

        function converterData(data: string): string {
            const [dia, mes, ano] = data.split('/');
            return `${ano}/${mes}/${dia}`;
        }

        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }

        const dataAtual = obterDataAtual();


        let {
            codigo,
            forma_pagamento,
            descontos,
            observacoes,
            observacoes2,
            quantidade_parcelas,
            total_geral,
            total_produtos,
            totalSemDesconto,
            situacao,
            tipo,
            vendedor,
            data_cadastro,
            veiculo,
            tipo_os,
            contato,
            just_ipi,
            just_icms,
            just_subst,
            codigo_cliente,
            descontos_produto
        } = orcamento;


        const servicos = orcamento.servicos;
        const parcelas = orcamento.parcelas;
        const produtos = orcamento.produtos;


        if (!situacao) {
            situacao = 'EA';
        }
        if (!quantidade_parcelas) {
            quantidade_parcelas = 0;
        }

        if (!vendedor) {
            vendedor = 1;
        }
        if (!tipo_os) {
            tipo_os = 0;
        }
        if (!veiculo) {
            veiculo = 0;
        }
        if (!data_cadastro) {
            data_cadastro = dataAtual;
        }
        if (!contato) {
            contato = '';
        }
        if (!observacoes) {
            observacoes = '';
        }
        if (!observacoes2) {
            observacoes2 = '';
        }
        if (!just_ipi) {
            just_ipi = '';
        }
        if (!just_icms) {
            just_icms = '';
        }
        if (!just_subst) {
            just_subst = '';
        }
        if (!forma_pagamento) {
            forma_pagamento = 0
        }
        if (!descontos) {
            descontos = 0
        }
        if (!descontos_produto) {
            descontos_produto = 0
        }



        async function buscaOrcamento(codigo: number) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${db_vendas}.cad_orca where codigo = ? `
                conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        }

        async function updateCad_orca() {
            return new Promise(async (resolve, reject) => {
                let sql = `
                    UPDATE ${db_vendas}.cad_orca  
                    set 
                    cliente = ${codigo_cliente},
                    total_geral = ${total_geral} ,
                    total_produtos = ${total_produtos} ,
                    tipo_os = ${tipo_os},
                    qtde_parcelas = ${quantidade_parcelas} ,
                    contato = '${contato}',
                    veiculo = ${veiculo},
                    forma_pagamento = ${forma_pagamento},
                    observacoes = '${observacoes}',
                    data_cadastro = '${data_cadastro}',
                    situacao =  '${situacao}'
                    where codigo = ${codigo}
                `
                console.log( sql )

                conn.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        // console.log(result);
                        resolve(result.affectedRows);
                    }
                })
            })
        }



        async function deletePro_orca(codigo: number) {
            return new Promise((resolve, reject) => {

                let sql2 = ` delete from ${db_vendas}.pro_orca
                                        where orcamento = ${codigo}
                                    `
                conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                })
            })

        }

        async function insertPro_orca(codigo: number, produtos: any) {

            for (let i = 0; i <= produtos.length; i++) {
                if (produtos[i] == undefined) {
                    produtos[i] = 1;
                    break;
                }

                let j = i + 1;
                await conn.query(
                    `INSERT INTO ${db_vendas}.pro_orca
                     (orcamento,
                      sequencia,
                      produto,
                      unitario,
                      quantidade,
                      preco_tabela,
                      tabela,
                      just_ipi,
                      just_icms,
                      just_subst,
                      total_liq,
                      unit_orig ) ` +
                    `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`,

                    [
                        codigo,
                        j,
                        produtos[i].codigo,
                        produtos[i].preco,
                        produtos[i].quantidade,
                        produtos[i].preco,
                        1, just_ipi,
                        just_icms,
                        just_subst,
                        produtos[i].total,
                        produtos[i].preco
                    ],

                    (err: any, result1: any) => {
                        if (err) {
                            console.log("erro ao inserir produtos ", err);
                            return response.status(500).json({ err: "erro ao gravar os produtos" });
                        } else {
                            console.log("produtos inseriridos com sucesso ");

                        };
                    }
                );
            }
        }

        async function insertSer_orca(codigo: number, servicos: any) {

            for (let i = 0; i < servicos.length; i++) {
                if (servicos[i] == undefined) {
                    servicos[i] = 1;
                    break;
                }

                let j = i + 1;
                conn.query(
                    ` INSERT INTO ${db_vendas}.ser_orca 
                    (
                      ORCAMENTO ,
                      SEQUENCIA, 
                      SERVICO,
                      QUANTIDADE,
                      UNITARIO,
                      DESCONTO,
                      PRECO_TABELA )
                    VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `,
                    [
                         codigo,
                         j,
                         servicos[i].codigo,
                         servicos[i].quantidade, 
                         servicos[i].valor, 
                         servicos[i].desconto,
                         servicos[i].valor
                        ], (err: any, resultServicos) => {
                            if (err) {
                                console.log(`ocorreu um erro ao inserir os servicos`, err)
                            } else {
                                console.log(' serviço inserido com sucesso ',resultServicos);

                            }
                        }
                )
            }

        }

        async function deleteSer_orca(codigo: number) {
            return new Promise((resolve, reject) => {

                let sql2 = ` delete from ${db_vendas}.ser_orca
                                        where orcamento = ${codigo}
                                    `
                conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log( " servico deletado com sucesso ",result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                })
            })

        }

        async function deletePar_orca(codigo: number) {
            return new Promise((resolve, reject) => {

                let sql2 = ` delete from ${db_vendas}.par_orca
                                        where orcamento = ${codigo}
                                    `
                conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log( " parcela deletada com sucesso ",result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                })
            })

        }


        async function insertPar_orca(codigo: any, parcelas: any) {
            parcelas.forEach((p: any) => {

                let vencimento = converterData(p.vencimento);
                conn.query(
                    ` INSERT INTO ${db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                 VALUES ( ?,?,?,?,?)`,
                    [codigo, p.parcela, p.valor,  p.vencimento , 1], (err: any, resultParcelas) => {
                        if (err) {
                            console.log("erro ao inserir parcelas !" + err)
                           // return response.status(500).json({ err: "erro ao as parcelas" });
                        } else {
//                            console.log(resultParcelas);
                        console.log( " parcela inserida com sucesso ",resultParcelas);

                        }
                    }
                )
            })


        }

        async function buscaProdutosDoOrcamento(codigo: number) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${db_vendas}.pro_orca where orcamento = ? `
                conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        }
        async function buscaServicosDoOrcamento(codigo: number) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${db_vendas}.ser_orca where orcamento = ? `
                conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        }
        async function buscaParcelasDoOrcamento(codigo: number) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${db_vendas}.par_orca where orcamento = ? `
                conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        }
        //console.log(request.body)

        let aux: any;
        let statusAtualizacao: any;
        let statusDeletePro_orca: any;
        let statusDeletePar_orca: any;

      
            try {
                statusAtualizacao = await updateCad_orca();
            } catch (err) {
                console.log(err);
               /// return response.status(500).json({ "msg": err });
            }

            if (statusAtualizacao) {
                
                const validaProdutos:any = await buscaProdutosDoOrcamento( codigo )
                if( validaProdutos.length > 0 ){
                    try {
                        statusDeletePro_orca = await deletePro_orca(codigo);
                    } catch (err) {
                        console.log(err);
                    //  return response.status(500).json({ "msg": err });
                    }
                    
                    if (produtos.length > 0) {
                        if (statusDeletePro_orca) {
                            try {
                                await insertPro_orca(codigo, produtos);
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    }
                }



              const validaServicos:any = await buscaServicosDoOrcamento( codigo )
              
              if( validaServicos.length > 0 ){
               
                try {
                    await deleteSer_orca(codigo)
                } catch (e) {
                    console.log(e);
                }

                if (servicos.length > 0) {

                    try {
                        await insertSer_orca(codigo, servicos);
                    } catch (e) { console.log(` erro ao inserir os servicos`, e) }

                }
            }

              const validaParcelas:any = await buscaParcelasDoOrcamento( codigo )

           if( validaParcelas.length > 0 ){

                if(statusAtualizacao ){
                    try{
                        statusDeletePar_orca = await deletePar_orca(codigo);
                        }catch(err){
                            console.log(err);
                            return response.status(500).json({"msg":err});
                        }   
                    } 

                if(statusDeletePar_orca){
                  try{
                     await insertPar_orca (codigo, parcelas);
                  }catch(err){
                      console.log(err)
                      return response.status(500).json({"msg":err});
                  }
               } 
            } 
          //      {
          //          "msg": ` orcamento ${codigoDoOrcamento} atualizado com sucesso!`,
          //          "codigo": `${codigoDoOrcamento}`
          //      });
        } else {
            console.log('nao foi encontrado orcamento com este codigo')
        }


    }


}