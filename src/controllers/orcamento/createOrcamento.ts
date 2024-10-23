import { Request, Response, request, response } from "express";
import { conn, db_vendas, db_estoque, db_publico } from "../../database/databaseConfig";

export class CreateOrcamento {



      converterData(data: string): string {
        const [dia, mes, ano] = data.split('/');
        return `${ano}-${mes}-${dia}`;
    }
      obterDataAtual() {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();
        return `${ano}-${mes}-${dia}`;
    }



    async create(orcamento:any) {

        return new Promise((resolve, reject)=>{

     
        const dataAtual = this.obterDataAtual();

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
            total_servicos,
            totalSemDesconto,
            situacao,
            tipo,
            vendedor,
            data_cadastro,
            data_recadastro,
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

        if (!data_recadastro) {
            data_recadastro = dataAtual;
        }

        
        if (!total_servicos) {
            total_servicos = 0;
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
         

          conn.query(
            `INSERT INTO ${db_vendas}.cad_orca ` +
            `(cliente, cod_site, total_produtos,total_servicos, forma_pagamento, tipo,  DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2, DATA_RECAD)  
                VALUES ( ? ,?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo_cliente, codigo, total_produtos, total_servicos ,forma_pagamento, tipo, descontos, total_geral, data_cadastro, situacao, vendedor, contato, data_cadastro, data_cadastro, data_cadastro, quantidade_parcelas, observacoes, observacoes2, data_recadastro],
            async    (err: any, result: any) => {
                if (err) {
                    console.log(err)
                     reject(err)
                } else {
                    codigo_pedido =  result.insertId;
                    
                    if (produtos.length > 0) {
                       try{
                           await this.cadastraProdutosDoPedido(produtos, codigo_pedido);
                        }catch(e){ console.log(e)} 
                    }


                    if(parcelas.length > 0 ){
                            try{
                             await this.cadastraParcelasDoPeidido(parcelas, codigo_pedido);
                            }catch(e) {
                                console.log(e)
                            }    
                       }

                       if(servicos.length > 0  ){
                            try{
                                await this.cadastraServicosDoPedido(servicos, codigo_pedido);
                            }catch(e){console.log(e)}
                       }
                        resolve(codigo_pedido) ;
                    }
                }
            )

        })

    }
 
	async cadastraProdutosDoPedido(produtos:any , codigoPedido:any ){
		return new Promise( async (resolve, reject )=>{

			let i=1;
			for(let p of produtos){
                let {
                    codigo,
                    preco,
                    quantidade,
                    desconto,
                    just_icms,
                    just_ipi,
                    just_subst,
                    total,
                    fator_val,
                    fator_qtde,
                    tabela,
                } = p

                 if( !preco) preco = 0;
                 if( !quantidade) quantidade = 0;
                 if( !desconto) desconto = 0;
                 if( !just_icms) just_icms = '';
                 if( !just_ipi) just_ipi = '';
                 if( !just_subst) just_subst = '';
                 if( !total) total = 0;
                 if ( !fator_val ) fator_val = 1;
                 if ( !fator_qtde ) fator_qtde = 1;
                 if ( !tabela ) tabela = 1; 
			 
             const sql =  `INSERT INTO ${db_vendas}.pro_orca (orcamento, sequencia, produto, fator_val, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig)
                VALUES ( 
                    '${codigoPedido}',
                    '${i}',
                    '${codigo}',
                    '${fator_val}',
                    '${fator_qtde}',
                    '${preco}',
                    '${quantidade}',
                    '${preco}',
                    '${desconto}',  
                    '${tabela}',  
                    '${just_ipi}',  
                    '${just_icms}',  
                    '${just_subst}',  
                    '${total}',  
                    '${preco}'  
                ) `;

			  await conn.query( sql, (error, resultado)=>{
				   if(error){
						   reject(" erro ao inserir produto do orcamento "+ error);
				   }else{
					resolve(resultado)
					   console.log(`produto  inserido com sucesso`);
				   }
				})

				if(i === produtos.length){
					return;
				}
				i++;
			}
		})
    }


    async cadastraParcelasDoPeidido(parcelas:any, codigoPedido:any){

        parcelas.forEach( async (p: any) => {
            let vencimento = this.converterData(p.vencimento);
        await    conn.query(
                ` INSERT INTO ${db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                     VALUES ( ?,?,?,?,?)`,
                [codigoPedido, p.parcela, p.valor, p.vencimento, 1], (err: any, resultParcelas) => {
                    if (err) {
                        console.log("erro ao inserir parcelas !" + err)
                        //  return response.status(500).json({ err: "erro ao as parcelas" });
                    } else {
                        console.log('  Parcela inserida com sucesso ', resultParcelas)
                    }
                }
            )
        })

    }

        async cadastraServicosDoPedido( servicos:any, codigoPedido:any ){
            if (servicos.length > 0) {

                for (let i = 0; i < servicos.length; i++) {
                    if (servicos[i] == undefined) {
                        servicos[i] = 1;
                        break;
                    }

                    let j = i + 1;
                    await conn.query(
                        ` INSERT INTO ${db_vendas}.ser_orca ( ORCAMENTO , SEQUENCIA, SERVICO, QUANTIDADE, UNITARIO, DESCONTO, PRECO_TABELA )
                            VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `,
                        [codigoPedido, j, servicos[i].codigo, servicos[i].quantidade, servicos[i].valor, servicos[i].desconto, servicos[i].valor], (err: any, resultServicos) => {
                            if (err) {
                                console.log(`ocorreu um erro ao inserir os servicos`, err)
                            } else {
                                console.log(" Servico inserido com sucesso ", resultServicos);
                            }
                        }
                    )
                }
            } 
        }

}