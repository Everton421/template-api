import { Request, Response, request, response } from "express";
import { conn, db_vendas, db_estoque, db_publico } from "../../database/databaseConfig";

export class CreateOrcamento {




    async create(orcamento:any) {

        function converterData(data: string): string {
            const [dia, mes, ano] = data.split('/');
            return `${ano}-${mes}-${dia}`;
        }
        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
        const dataAtual = obterDataAtual();

        let codigo_pedido;
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
        } = orcamento;



        const servicos = orcamento.servicos;
        const parcelas = orcamento.parcelas;
        const produtos = orcamento.produtos;

        if (!situacao) {
            situacao = 'EA';
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
        if (!quantidade_parcelas) {
            quantidade_parcelas = 0
        }
         

        await conn.query(
            `INSERT INTO ${db_vendas}.cad_orca ` +
            `(cliente, cod_site, total_produtos, forma_pagamento, tipo,  DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2)  
                VALUES ( ? ,?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?, ?)`,
            [codigo_cliente, codigo, total_produtos, forma_pagamento, tipo, descontos, total_geral, data_cadastro, situacao, vendedor, contato, data_cadastro, data_cadastro, data_cadastro, quantidade_parcelas, observacoes, observacoes2],
            (err: any, result: any) => {
                if (err) {
                    console.log(err)
                    return;
                    // return response.status(500).json(err.message);
                } else {
                    const codigoOrcamento = result.insertId;
                    codigo_pedido =  result.insertId;

                    if (produtos.length > 0) {

                        for (let i = 0; i <= produtos.length; i++) {
                            if (produtos[i] == undefined) {
                                produtos[i] = 1;
                                break;
                            }

                            let j = i + 1;
                            conn.query(
                                `INSERT INTO ${db_vendas}.pro_orca (orcamento, sequencia, produto, fator_val, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig) ` +
                                `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?  )`,
                                [codigoOrcamento, j, produtos[i].codigo, 1, 1, produtos[i].preco, produtos[i].quantidade, produtos[i].preco, produtos[i].desconto, 1, just_ipi, just_icms, just_subst, produtos[i].total, produtos[i].preco],
                                (err: any, result1: any) => {
                                    if (err) {
                                        console.log("erro ao inserir produtos ", err);
                                        // return response.status(500).json({ err: "erro ao gravar os produtos" });
                                    } else {
                                        console.log(" Produto inserido com sucesso! ", result1)
                                    };
                                }
                            );
                        }
                    }


                    parcelas.forEach((p: any) => {
                        let vencimento = converterData(p.vencimento);
                        conn.query(
                            ` INSERT INTO ${db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                                 VALUES ( ?,?,?,?,?)`,
                            [codigoOrcamento, p.parcela, p.valor, p.vencimento, 1], (err: any, resultParcelas) => {
                                if (err) {
                                    console.log("erro ao inserir parcelas !" + err)
                                    //  return response.status(500).json({ err: "erro ao as parcelas" });
                                } else {
                                    console.log('  Parcela inserida com sucesso ', resultParcelas)
                                }
                            }
                        )
                    })


                    if (servicos.length > 0) {

                        for (let i = 0; i < servicos.length; i++) {
                            if (servicos[i] == undefined) {
                                servicos[i] = 1;
                                break;
                            }

                            let j = i + 1;
                            conn.query(
                                ` INSERT INTO ${db_vendas}.ser_orca ( ORCAMENTO , SEQUENCIA, SERVICO, QUANTIDADE, UNITARIO, DESCONTO, PRECO_TABELA )
                                    VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `,
                                [codigoOrcamento, j, servicos[i].codigo, servicos[i].quantidade, servicos[i].valor, servicos[i].desconto, servicos[i].valor], (err: any, resultServicos) => {
                                    if (err) {
                                        console.log(`ocorreu um erro ao inserir os servicos`, err)
                                    } else {
                                        console.log(" Servico inserido com sucesso ", resultServicos);
                                    }
                                }
                            )
                        }
                    }

                    //console.log(result.insertId)
                    //   return response.status(200).json({"msg":`orcamento ${result.insertId} inserido com sucesso!`, "codigo":result.insertId})
                }

            }
        )

        return codigo_pedido;


    }
 


}