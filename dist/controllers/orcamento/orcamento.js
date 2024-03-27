"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlerOrcamento = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class controlerOrcamento {
    async cadastra(request, response) {
        const { descontos, observacoes, observacoes2, qtde_parcelas, totalGeral, totalProdutos, totalSemDesconto, situacao, vendedor, contato, } = request.body;
        const { codigoCliente, cnpj, rg, nome } = request.body.cliente;
        const { formaDePagamento, qtde, valorParcela } = request.body.parcelas;
        const produtos = request.body.produtos;
        produtos.forEach((p) => {
            if (p.CODIGO == undefined) {
                return response.status(500).json({ "erro": "nao informado o codigo do produto" });
            }
        });
        if (codigoCliente == undefined || request.body.cliente == undefined) {
            return response.status(500).json({ "erro": "nao informado o codigo do cliente" });
        }
        function obterDataAtual() {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
        const dataAtual = obterDataAtual();
        await databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.cad_orca ` +
            `(cliente, total_produtos, DESC_PROD, TOTAL_GERAL, DATA_CADASTRO, SITUACAO,VENDEDOR,CONTATO , DATA_INICIO,DATA_PEDIDO, DATA_APROV, QTDE_PARCELAS, OBSERVACOES,OBSERVACOES2)  
                VALUES (?, ?, ?, ?, ?, ?, ? , ? , ? ,?, ?, ?, ?, ?)`, [codigoCliente, totalProdutos, descontos, totalGeral, dataAtual, situacao, vendedor, contato, dataAtual, dataAtual, dataAtual, qtde_parcelas, observacoes, observacoes2], (err, result) => {
            if (err) {
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
                    databaseConfig_1.conn.query(`INSERT INTO ${databaseConfig_1.db_vendas}.pro_orca (orcamento, sequencia, produto, unitario, quantidade, preco_tabela,tabela, total_liq, unit_orig) ` +
                        `VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?)`, [codigoOrcamento, j, produtos[i].CODIGO, produtos[i].PRECO, produtos[i].QUANTIDADE, produtos[i].PRECO, 1, produtos[i].total_produtos, produtos[i].PRECO], (err, result1) => {
                        if (err) {
                            return response.status(500).json({ err: "erro ao gravar os produtos" });
                        }
                        ;
                    });
                }
                console.log(result.insertId);
                return response.json(result.insertId);
            }
        });
    }
}
exports.controlerOrcamento = controlerOrcamento;
