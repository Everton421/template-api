"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlerOrcamento = void 0;
const express_1 = require("express");
const databaseConfig_1 = require("../../database/databaseConfig");
class controlerOrcamento {
    async create(orcamento) {
        function converterData(data) {
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
        let { codigo, forma_pagamento, descontos, observacoes, observacoes2, quantidade_parcelas, total_geral, total_produtos, totalSemDesconto, situacao, tipo, vendedor, data_cadastro, veiculo, tipo_os, contato, just_ipi, just_icms, just_subst, codigo_cliente, } = orcamento;
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
            forma_pagamento = 0;
        }
        if (!descontos) {
            descontos = 0;
        }
        if (!quantidade_parcelas) {
            quantidade_parcelas = 0;
        }
        await databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.cad_orca ` +
            `(cliente, cod_site, total_produtos, forma_pagamento, tipo,  DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2)  
                VALUES ( ? ,?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?, ?)`, [codigo_cliente, codigo, total_produtos, forma_pagamento, tipo, descontos, total_geral, data_cadastro, situacao, vendedor, contato, data_cadastro, data_cadastro, data_cadastro, quantidade_parcelas, observacoes, observacoes2], (err, result) => {
            if (err) {
                console.log(err);
                return;
                // return response.status(500).json(err.message);
            }
            else {
                const codigoOrcamento = result.insertId;
                codigo_pedido = result.insertId;
                if (produtos.length > 0) {
                    for (let i = 0; i <= produtos.length; i++) {
                        if (produtos[i] == undefined) {
                            produtos[i] = 1;
                            break;
                        }
                        let j = i + 1;
                        databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca (orcamento, sequencia, produto, fator_val, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig) ` +
                            `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?  )`, [codigoOrcamento, j, produtos[i].codigo, 1, 1, produtos[i].preco, produtos[i].quantidade, produtos[i].preco, produtos[i].desconto, 1, just_ipi, just_icms, just_subst, produtos[i].total, produtos[i].preco], (err, result1) => {
                            if (err) {
                                console.log("erro ao inserir produtos ", err);
                                // return response.status(500).json({ err: "erro ao gravar os produtos" });
                            }
                            else {
                                console.log(" Produto inserido com sucesso! ", result1);
                            }
                            ;
                        });
                    }
                }
                parcelas.forEach((p) => {
                    let vencimento = converterData(p.vencimento);
                    databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                                 VALUES ( ?,?,?,?,?)`, [codigoOrcamento, p.parcela, p.valor, p.vencimento, 1], (err, resultParcelas) => {
                        if (err) {
                            console.log("erro ao inserir parcelas !" + err);
                            //  return response.status(500).json({ err: "erro ao as parcelas" });
                        }
                        else {
                            console.log('  Parcela inserida com sucesso ', resultParcelas);
                        }
                    });
                });
                if (servicos.length > 0) {
                    for (let i = 0; i < servicos.length; i++) {
                        if (servicos[i] == undefined) {
                            servicos[i] = 1;
                            break;
                        }
                        let j = i + 1;
                        databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.ser_orca ( ORCAMENTO , SEQUENCIA, SERVICO, QUANTIDADE, UNITARIO, DESCONTO, PRECO_TABELA )
                                    VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `, [codigoOrcamento, j, servicos[i].codigo, servicos[i].quantidade, servicos[i].valor, servicos[i].desconto, servicos[i].valor], (err, resultServicos) => {
                            if (err) {
                                console.log(`ocorreu um erro ao inserir os servicos`, err);
                            }
                            else {
                                console.log(" Servico inserido com sucesso ", resultServicos);
                            }
                        });
                    }
                }
                //console.log(result.insertId)
                //   return response.status(200).json({"msg":`orcamento ${result.insertId} inserido com sucesso!`, "codigo":result.insertId})
            }
        });
        return codigo_pedido;
    }
    async update(orcamento) {
        function converterData(data) {
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
        let { codigo, forma_pagamento, descontos, observacoes, observacoes2, quantidade_parcelas, total_geral, total_produtos, totalSemDesconto, situacao, tipo, vendedor, data_cadastro, veiculo, tipo_os, contato, just_ipi, just_icms, just_subst, codigo_cliente, descontos_produto } = orcamento;
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
            forma_pagamento = 0;
        }
        if (!descontos) {
            descontos = 0;
        }
        if (!descontos_produto) {
            descontos_produto = 0;
        }
        async function buscaOrcamento(codigo) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${databaseConfig_1.db_vendas}.cad_orca where codigo = ? `;
                databaseConfig_1.conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        async function updateCad_orca() {
            return new Promise(async (resolve, reject) => {
                let sql = `
                    UPDATE ${databaseConfig_1.db_vendas}.cad_orca  
                    set 
                    cliente = ${codigo_cliente},
                    total_geral = ${total_geral} ,
                    total_produtos = ${total_produtos} ,
                    qtde_parcelas = ${quantidade_parcelas} ,
                    contato = '${contato}',
                    veiculo = ${veiculo},
                    forma_pagamento = ${forma_pagamento},
                    observacoes = '${observacoes}',
                    data_cadastro = '${data_cadastro}',
                    situacao =  '${situacao}'
                    where codigo = ${codigo}
                `;
                console.log(sql);
                databaseConfig_1.conn.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // console.log(result);
                        resolve(result.affectedRows);
                    }
                });
            });
        }
        async function deletePro_orca(codigo) {
            return new Promise((resolve, reject) => {
                let sql2 = ` delete from ${databaseConfig_1.db_vendas}.pro_orca
                                        where orcamento = ${codigo}
                                    `;
                databaseConfig_1.conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                });
            });
        }
        async function insertPro_orca(codigo, produtos) {
            for (let i = 0; i <= produtos.length; i++) {
                if (produtos[i] == undefined) {
                    produtos[i] = 1;
                    break;
                }
                let j = i + 1;
                await databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca
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
                    `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
                ], (err, result1) => {
                    if (err) {
                        console.log("erro ao inserir produtos ", err);
                        return express_1.response.status(500).json({ err: "erro ao gravar os produtos" });
                    }
                    else {
                        console.log("produtos inseriridos com sucesso ");
                    }
                    ;
                });
            }
        }
        async function insertSer_orca(codigo, servicos) {
            for (let i = 0; i < servicos.length; i++) {
                if (servicos[i] == undefined) {
                    servicos[i] = 1;
                    break;
                }
                let j = i + 1;
                databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.ser_orca 
                    (
                      ORCAMENTO ,
                      SEQUENCIA, 
                      SERVICO,
                      QUANTIDADE,
                      UNITARIO,
                      DESCONTO,
                      PRECO_TABELA )
                    VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `, [
                    codigo,
                    j,
                    servicos[i].codigo,
                    servicos[i].quantidade,
                    servicos[i].valor,
                    servicos[i].desconto,
                    servicos[i].valor
                ], (err, resultServicos) => {
                    if (err) {
                        console.log(`ocorreu um erro ao inserir os servicos`, err);
                    }
                    else {
                        console.log(' serviço inserido com sucesso ', resultServicos);
                    }
                });
            }
        }
        async function deleteSer_orca(codigo) {
            return new Promise((resolve, reject) => {
                let sql2 = ` delete from ${databaseConfig_1.db_vendas}.ser_orca
                                        where orcamento = ${codigo}
                                    `;
                databaseConfig_1.conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(" servico deletado com sucesso ", result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                });
            });
        }
        async function deletePar_orca(codigo) {
            return new Promise((resolve, reject) => {
                let sql2 = ` delete from ${databaseConfig_1.db_vendas}.par_orca
                                        where orcamento = ${codigo}
                                    `;
                databaseConfig_1.conn.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(" parcela deletada com sucesso ", result);
                        resolve(result);
                        // statusAtualizacao = result.serverStatus ;
                    }
                });
            });
        }
        async function insertPar_orca(codigo, parcelas) {
            parcelas.forEach((p) => {
                let vencimento = converterData(p.vencimento);
                databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                 VALUES ( ?,?,?,?,?)`, [codigo, p.parcela, p.valor, p.vencimento, 1], (err, resultParcelas) => {
                    if (err) {
                        console.log("erro ao inserir parcelas !" + err);
                        // return response.status(500).json({ err: "erro ao as parcelas" });
                    }
                    else {
                        //                            console.log(resultParcelas);
                        console.log(" parcela inserida com sucesso ", resultParcelas);
                    }
                });
            });
        }
        async function buscaProdutosDoOrcamento(codigo) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${databaseConfig_1.db_vendas}.pro_orca where orcamento = ? `;
                databaseConfig_1.conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        async function buscaServicosDoOrcamento(codigo) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${databaseConfig_1.db_vendas}.ser_orca where orcamento = ? `;
                databaseConfig_1.conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        async function buscaParcelasDoOrcamento(codigo) {
            return new Promise((resolve, reject) => {
                const sql = ` select *  from ${databaseConfig_1.db_vendas}.par_orca where orcamento = ? `;
                databaseConfig_1.conn.query(sql, [codigo], async (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
        }
        //console.log(request.body)
        let aux;
        let statusAtualizacao;
        let statusDeletePro_orca;
        let statusDeletePar_orca;
        try {
            statusAtualizacao = await updateCad_orca();
        }
        catch (err) {
            console.log(err);
            /// return response.status(500).json({ "msg": err });
        }
        if (statusAtualizacao) {
            const validaProdutos = await buscaProdutosDoOrcamento(codigo);
            if (validaProdutos.length > 0) {
                if (produtos.length > 0) {
                    try {
                        statusDeletePro_orca = await deletePro_orca(codigo);
                    }
                    catch (err) {
                        console.log(err);
                        //  return response.status(500).json({ "msg": err });
                    }
                    if (statusDeletePro_orca) {
                        try {
                            await insertPro_orca(codigo, produtos);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
            const validaServicos = await buscaServicosDoOrcamento(codigo);
            if (validaServicos.length > 0) {
                if (servicos.length > 0) {
                    try {
                        await deleteSer_orca(codigo);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    try {
                        await insertSer_orca(codigo, servicos);
                    }
                    catch (e) {
                        console.log(` erro ao inserir os servicos`, e);
                    }
                }
            }
            const validaParcelas = await buscaParcelasDoOrcamento(codigo);
            if (validaParcelas.length > 0) {
                if (statusAtualizacao) {
                    try {
                        statusDeletePar_orca = await deletePar_orca(codigo);
                    }
                    catch (err) {
                        console.log(err);
                        return express_1.response.status(500).json({ "msg": err });
                    }
                }
                if (statusDeletePar_orca) {
                    try {
                        await insertPar_orca(codigo, parcelas);
                    }
                    catch (err) {
                        console.log(err);
                        return express_1.response.status(500).json({ "msg": err });
                    }
                }
            }
            //      {
            //          "msg": ` orcamento ${codigoDoOrcamento} atualizado com sucesso!`,
            //          "codigo": `${codigoDoOrcamento}`
            //      });
        }
        else {
            console.log('nao foi encontrado orcamento com este codigo');
        }
    }
    async buscaOrcamentosDoDia(request, response) {
        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
        let aux = obterDataAtual();
        let filtro;
        let parametros;
        console.log('');
        console.log('');
        console.log(request.query);
        console.log('');
        console.log('');
        let vend = request.query.vendedor;
        let vendedor = parseInt(aux);
        let parametro = request.query.parametro;
        if (!vendedor || vendedor === undefined) {
            vendedor = 0;
        }
        //  console.log(vendedor);
        if (parametro !== '*') {
            filtro = `( cli.nome LIKE ? or co.codigo like ? ) AND co.vendedor = ${vendedor} `;
            parametros = [`%${parametro}%`, `%${parametro}%`, vendedor];
        }
        else {
            // busca os dadso com a data de hj, caso nao tenha sido passado nenhum parametro
            filtro = `co.data_cadastro LIKE ? and co.vendedor = ${vendedor}`;
            parametros = [`%${aux}%`];
        }
        const sql = `
        SELECT co.codigo, co.total_geral, cli.nome, co.data_cadastro, co.situacao, co.vendedor,co.tipo, 
         DATE_FORMAT( co.data_cadastro, '%Y-%m-%d') as data_cadastro
        FROM ${databaseConfig_1.db_vendas}.cad_orca co
        JOIN ${databaseConfig_1.db_publico}.cad_clie cli ON cli.codigo = co.cliente
        WHERE ${filtro};
    `;
        console.log(sql);
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(sql, parametros, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    // console.log(result);
                    if (result.length > 0) {
                        resolve(response.json(result));
                    }
                    else {
                        return response.status(500).json("nenhum Orçamento encontrado");
                    }
                }
            });
        });
    }
    async validaOrcamento(codigo, vendedor) {
        return new Promise(async (resolve, reject) => {
            const sql = ` select * from ${databaseConfig_1.db_vendas}.cad_orca where COD_SITE = ${codigo} and vendedor = ${vendedor} `;
            databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    // console.log(result)
                    resolve(result);
                }
            });
        });
    }
    // filtra orcamentos de hj
    async buscaPorCodigo(request, response) {
        const codigo_orcamento = request.params.codigo;
        let dados;
        let produtosOrcamento = [];
        async function buscaProdutosDoOrcamento(codigo_orcamento) {
            let sql = `
                             select 
                              po.orcamento,
                              po.produto codigo,
                              cp.descricao,
                              po.fator_qtde as quantidade,
                              po.unitario as preco,
                              po.desconto,
                              po.total_liq as total  
                                  from ${databaseConfig_1.db_vendas}.pro_orca po
                                  join ${databaseConfig_1.db_publico}.cad_prod cp on cp.codigo = po.produto
                                  where orcamento = ?  ;`;
            return new Promise((resolve, reject) => {
                databaseConfig_1.conn.query(sql, [codigo_orcamento], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                        // console.log(result);
                    }
                });
            });
        }
        async function parcelasDoOrcamento(codigo_orcamento) {
            let sql = `
                             select   orcamento, parcela, valor, DATE_FORMAT(vencimento, '%Y-%m-%d') as vencimento, tipo_receb   from ${databaseConfig_1.db_vendas}.par_orca where orcamento = ?  ;`;
            return new Promise((resolve, reject) => {
                databaseConfig_1.conn.query(sql, [codigo_orcamento], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(result);
                        // console.log(result);
                    }
                });
            });
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
               co.qtde_parcelas parcelas, 
               co.total_produtos total_produtos,
               cli.nome,
               co.data_cadastro
             
             from ${databaseConfig_1.db_vendas}.cad_orca co
                            join ${databaseConfig_1.db_publico}.cad_clie cli on cli.codigo = co.cliente
                            where co.codigo  = ?
                            ;
                        `;
        //  console.log(sql)
        //  console.log('')
        //  console.log('')
        //  console.log('')
        await databaseConfig_1.conn.query(sql, [codigo_orcamento], async (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                let produtos;
                let parcelas;
                let data;
                try {
                    produtos = await buscaProdutosDoOrcamento(codigo_orcamento);
                }
                catch (erro) {
                    console.log(`erro ao buscar produtos ${erro}`);
                }
                try {
                    parcelas = await parcelasDoOrcamento(codigo_orcamento);
                }
                catch (erro) {
                    console.log(`erro ao buscar produtos ${erro}`);
                }
                if (produtos.length === 0) {
                    produtos = [];
                }
                if (parcelas.length === 0) {
                    parcelas = [];
                }
                if (result.length > 0) {
                    data = {
                        "cliente": {
                            "codigo": result[0].codigo_cliente,
                            "nome": result[0].nome,
                            "cnpj": result[0].cnpj,
                            "celular": result[0].celular,
                        },
                        "orcamento": result[0].orcamento,
                        "total_geral": result[0].total_geral,
                        "total_produtos": result[0].total_produtos,
                        "quantidade_parcelas": result[0].parcelas,
                        "forma_pagamento": result[0].forma_pagamento,
                        "contato": result[0].contato,
                        "produtos": produtos,
                        "parcelas": parcelas
                    };
                }
                // console.log(data)
                response.json(data);
            }
        });
    }
}
exports.controlerOrcamento = controlerOrcamento;
