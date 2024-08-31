"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsereProdutos = void 0;
const express_1 = require("express");
class InsereProdutos {
    async index(json, conexao, dbpublico, dbestoque, res) {
        if (!json.produto) {
            console.log('Produto não informado');
            return express_1.response.status(500).json({ error: "Produto não informado" });
        }
        const sku = json.produto.sku;
        const aux = await this.validaSkuCadastrado(sku, conexao, dbpublico);
        if (aux.length > 0) {
            // console.log("Produto já cadastrado com esse SKU");
            return express_1.response.status(500).json({ err: "Produto já cadastrado com esse SKU" });
        }
        const idProd = await this.insertProduto(json.produto, conexao, dbpublico);
        if (!idProd) {
            console.log('erro ao cadastrar');
            return express_1.response.status(500).json({ err: "erro ao cadastrar produto" });
        }
        try {
            await this.insertTabelaDePrecos(json, idProd, conexao, dbpublico);
            console.log("tabela ok produto:" + idProd);
        }
        catch (err) {
            console.log(err);
            return express_1.response.status(500).json({ err: "erro ao cadastrar tabela de preços" });
        }
        try {
            await this.insertUnidade(json, idProd, conexao, dbpublico);
            console.log("unidades ok produto:" + idProd);
        }
        catch (err) {
            return express_1.response.status(500).json({ err: "erro ao cadastrar unidade de medida" });
        }
        try {
            await this.insertProdutoSetor(json, idProd, conexao, dbestoque);
            console.log("setor ok produto:" + idProd);
        }
        catch (err) {
            return express_1.response.status(500).json({ err: "erro ao cadastrar setor" });
        }
        return express_1.response.status(200).json({ "codigo": idProd });
    }
    async insertProduto(produto, conexao, publico) {
        const { codigo, grupo, descricao, numfabricante, num_original, sku, marca, ativo, tipo, class_fiscal, origem, cst, observacoes1, observacoes2, observacoes3 } = produto;
        return new Promise(async (resolve, reject) => {
            await conexao.query(` INSERT INTO ${publico}.cad_prod 
            (GRUPO, DESCRICAO, NUM_FABRICANTE, NUM_ORIGINAL, OUTRO_COD, APLICACAO, DATA_CADASTRO, MARCA, ATIVO, TIPO, CLASS_FISCAL, ORIGEM, CST, OBSERVACOES1, OBSERVACOES2, OBSERVACOES3)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [grupo, descricao, ' ', num_original, sku, descricao, marca, ativo, tipo, class_fiscal, origem, cst, observacoes1, observacoes2, observacoes3], (err, result) => {
                if (err) {
                    reject(err.sqlMessage);
                }
                else {
                    resolve(result.insertId);
                }
            });
        });
    }
    async insertTabelaDePrecos(json, codigo, conexao, publico) {
        const { tabela, produto, lbv, preco, promocao, valid_prom, promocao_net, valid_prom_net, lbc, prom_especial, data_recad, prom_especial_net, valor_frete, inicio_prom } = json;
        return new Promise((resolve, reject) => {
            conexao.query(`INSERT INTO ${publico}.prod_tabprecos (TABELA, PRODUTO)
                VALUES (?, ?)`, [1, codigo], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async validaTabelaDePreco(codigo, conexao, publico) {
        return new Promise(async (reject, resolve) => {
            await conexao.query(` SELECT produto FROM ${publico}.prod_tabpreco WHERE produto =${codigo};`, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async insertUnidade(json, codigo, conexao, publico) {
        const { item, descricao, sigla, fracionavel, fator_val, fator_qtde, padr_ent, padr_sai, padr_sep, und_trib } = json;
        return new Promise((resolve, reject) => {
            conexao.query(` INSERT INTO ${publico}.unid_prod 
                    (PRODUTO, ITEM, DESCRICAO, SIGLA, FRACIONAVEL, PADR_ENT, PADR_SAI, PADR_SEP, UND_TRIB)
                    VALUES( ?,?,?,?,?,?,?,?,?)
                `, [codigo, 1, "UNIDADE", 'UND', 'S', 'S', 'S', 'S', 'S',], (err, result) => {
                if (err) {
                    reject(err.sqlMessage);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async insertProdutoSetor(json, codigo, conexao, dbestoque) {
        const { codigoSetor, nome_setor, produto, estoque, local1, local2, local3, data_recad, local, } = json;
        return new Promise(async (resolve, reject) => {
            await conexao.query(` INSERT INTO ${dbestoque}.prod_setor 
            ( SETOR, PRODUTO, ESTOQUE, LOCAL1_PRODUTO, LOCAL2_PRODUTO, LOCAL3_PRODUTO, LOCAL_PRODUTO)
            VALUES( ?,?,?,?,?,?,?)
            `, [1, codigo, 0, '', '', '', ''], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaProdutoCadastrado(codigo, conexao, dbestoque, dbpublico) {
        return new Promise((reject, resolve) => {
            conexao.query(`
            SELECT p.codigo, p.descricao, ps.estoque, pp.preco
            FROM ${dbpublico}.cad_prod p
            JOIN ${dbestoque}.prod_setor ps ON p.codigo = ps.produto
            JOIN ${dbpublico}.prod_tabprecos pp ON p.codigo = pp.produto
            WHERE p.CODIGO = ${codigo};
                `, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async validaSkuCadastrado(codigo, conexao, dbpublico) {
        return new Promise((resolve, reject) => {
            conexao.query(`SELECT * FROM ${dbpublico}.cad_prod WHERE OUTRO_COD = ?`, [`${codigo}`], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.InsereProdutos = InsereProdutos;
