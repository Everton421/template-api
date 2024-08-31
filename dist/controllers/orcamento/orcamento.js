"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlerOrcamento = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class controlerOrcamento {
    async cadastra(request, response) {
        function converterData(data) {
            const [dia, mes, ano] = data.split('/');
            return `${ano}/${mes}/${dia}`;
        }
        console.log('');
        console.log('');
        console.log(request.body);
        let { formaPagamento, descontos, observacoes, observacoes2, quantidade_parcelas, total_geral, total_produtos, totalSemDesconto, situacao, vendedor, contato, just_ipi, just_icms, just_subst, } = request.body;
        const codigoCliente = request.body.cliente.codigo;
        const produtos = request.body.produtos;
        const parcelas = request.body.parcelas;
        if (!situacao) {
            situacao = 'EA';
        }
        if (!vendedor) {
            vendedor = 1;
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
        if (!formaPagamento) {
            formaPagamento = 0;
        }
        if (!descontos) {
            descontos = 0;
        }
        produtos.forEach((p) => {
            if (p.codigo == undefined) {
                return response.status(500).json({ "erro": "nao informado o codigo do produto" });
            }
        });
        if (codigoCliente == undefined || request.body.cliente == undefined) {
            return response.status(500).json({ "erro": "nao informado o codigo do cliente" });
        }
        console.log("dados recebidos  " + request.body);
        console.log(request.body);
        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
        const dataAtual = obterDataAtual();
        await databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.cad_orca ` +
            `(cliente, total_produtos, forma_pagamento,  DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2)  
                VALUES (?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?, ?)`, [codigoCliente, total_produtos, formaPagamento, descontos, total_geral, dataAtual, situacao, vendedor, contato, dataAtual, dataAtual, dataAtual, quantidade_parcelas, observacoes, observacoes2], (err, result) => {
            if (err) {
                console.log(err);
                return response.status(500).json(err.message);
            }
            else {
                const codigoOrcamento = result.insertId;
                for (let i = 0; i <= produtos.length; i++) {
                    if (produtos[i] == undefined) {
                        produtos[i] = 1;
                        break;
                    }
                    let j = i + 1;
                    databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca (orcamento, sequencia, produto,  unitario, quantidade, preco_tabela, tabela, just_ipi, just_icms, just_subst, total_liq, unit_orig) ` +
                        `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`, [codigoOrcamento, j, produtos[i].codigo, produtos[i].preco, produtos[i].quantidade, produtos[i].preco, 1, just_ipi, just_icms, just_subst, produtos[i].total, produtos[i].preco], (err, result1) => {
                        if (err) {
                            console.log("erro ao inserir produtos ", err);
                            return response.status(500).json({ err: "erro ao gravar os produtos" });
                        }
                        ;
                    });
                }
                parcelas.forEach((p) => {
                    let vencimento = converterData(p.vencimento);
                    databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                                 VALUES ( ?,?,?,?,?)`, [codigoOrcamento, p.parcela, p.valor, `${vencimento}`, 1], (err, resultParcelas) => {
                        if (err) {
                            console.log("erro ao inserir parcelas !" + err);
                            return response.status(500).json({ err: "erro ao as parcelas" });
                        }
                        else {
                            console.log(resultParcelas);
                        }
                    });
                });
                console.log(result.insertId);
                return response.status(200).json({ "msg": `orcamento ${result.insertId} inserido com sucesso!`, "codigo": result.insertId });
            }
        });
    }
    async atualizaOrcamento(request, response) {
        let { formaPagamento, descontos, observacoes, observacoes2, quantidade_parcelas, total_geral, total_produtos, totalSemDesconto, situacao, vendedor, contato, just_ipi, just_icms, just_subst, } = request.body;
        const codigoCliente = request.body.cliente.codigo;
        const produtos = request.body.produtos;
        const parcelas = request.body.parcelas;
        const codigoDoOrcamento = request.body.orcamento;
        if (!situacao) {
            situacao = 'EA';
        }
        if (!vendedor) {
            vendedor = 1;
        }
        if (!contato) {
            contato = null;
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
        if (!formaPagamento) {
            formaPagamento = 0;
        }
        function converterData(data) {
            const [dia, mes, ano] = data.split('/');
            return `${ano}/${mes}/${dia}`;
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
                    total_geral = ${total_geral} , total_produtos = ${total_produtos} , qtde_parcelas = ${quantidade_parcelas} , contato = ${contato} 
                    where codigo = ${codigoDoOrcamento}
                `;
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
                await databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca (orcamento, sequencia, produto,  unitario, quantidade, preco_tabela, tabela, just_ipi, just_icms, just_subst, total_liq, unit_orig) ` +
                    `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)`, [codigo, j, produtos[i].codigo, produtos[i].preco, produtos[i].quantidade, produtos[i].preco, 1, just_ipi, just_icms, just_subst, produtos[i].total, produtos[i].preco], (err, result1) => {
                    if (err) {
                        console.log("erro ao inserir produtos ", err);
                        return response.status(500).json({ err: "erro ao gravar os produtos" });
                    }
                    else {
                        console.log("produtos atualizados com sucesso ");
                    }
                    ;
                });
            }
        }
        async function insertPar_orca(codigo, parcelas) {
            parcelas.forEach((p) => {
                let vencimento = converterData(p.vencimento);
                databaseConfig_1.conn.query(` INSERT INTO ${databaseConfig_1.db_vendas}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                                                 VALUES ( ?,?,?,?,?)`, [codigo, p.parcela, p.valor, `${vencimento}`, 1], (err, resultParcelas) => {
                    if (err) {
                        console.log("erro ao inserir parcelas !" + err);
                        return response.status(500).json({ err: "erro ao as parcelas" });
                    }
                    else {
                        console.log(resultParcelas);
                    }
                });
            });
        }
        //console.log(request.body)
        let aux;
        let statusAtualizacao;
        let statusDeletePro_orca;
        let statusDeletePar_orca;
        if (codigoDoOrcamento > 0) {
            try {
                aux = await buscaOrcamento(codigoDoOrcamento);
            }
            catch (err) {
                console.log(err);
                return response.status(500).json({ "msg": err });
            }
        }
        if (aux.length > 0) {
            try {
                statusAtualizacao = await updateCad_orca();
            }
            catch (err) {
                console.log(err);
                return response.status(500).json({ "msg": err });
            }
            if (statusAtualizacao) {
                try {
                    statusDeletePro_orca = await deletePro_orca(codigoDoOrcamento);
                }
                catch (err) {
                    console.log(err);
                    return response.status(500).json({ "msg": err });
                }
            }
            if (statusDeletePro_orca) {
                try {
                    await insertPro_orca(codigoDoOrcamento, produtos);
                }
                catch (err) {
                    console.log(err);
                    return response.status(500).json({ "msg": err });
                }
            }
            /**    if(statusAtualizacao ){
                  try{
                      statusDeletePar_orca = await deletePar_orca(codigoDoOrcamento);
                      }catch(err){
                          console.log(err);
                          return response.status(500).json({"msg":err});
                      }
                   }*/
            /**    if(statusDeletePar_orca){
                  try{
                     await insertPar_orca (codigoDoOrcamento, produtos);
                  }catch(err){
                      console.log(err)
                      return response.status(500).json({"msg":err});
                  }
               }*/
            response.status(200).json({
                "msg": ` orcamento ${codigoDoOrcamento} atualizado com sucesso!`,
                "codigo": `${codigoDoOrcamento}`
            });
        }
        else {
            console.log('nao foi encontrado orcamento com este codigo');
        }
    }
    // filtra orcamentos de hj
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
        // console.log('');
        // console.log(request.params.filtro);
        // console.log('');
        if (request.params.filtro !== '*') {
            filtro = 'cli.nome LIKE ? or co.codigo like ? ';
            parametros = [`%${request.params.filtro}%`, `%${request.params.filtro}%`];
        }
        else {
            filtro = 'co.data_cadastro LIKE ?';
            parametros = [`%${aux}%`];
        }
        const sql = `
        SELECT co.codigo, co.total_geral, cli.nome, co.data_cadastro, co.situacao, 
         DATE_FORMAT( co.data_cadastro, '%Y-%m-%d') as data_cadastro
        FROM ${databaseConfig_1.db_vendas}.cad_orca co
        JOIN ${databaseConfig_1.db_publico}.cad_clie cli ON cli.codigo = co.cliente
        WHERE ${filtro};
    `;
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(sql, parametros, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    // console.log(result);
                    resolve(response.json(result));
                }
            });
        });
    }
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
