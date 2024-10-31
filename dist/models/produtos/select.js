"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select_produtos = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Select_produtos {
    async buscaPorCodigo(empresa, codigo) {
        return new Promise(async (resolve, reject) => {
            let sql = `
         select 
            *,
             CONVERT(observacoes1 USING utf8) as observacoes1,
             CONVERT(observacoes2 USING utf8) as observacoes2,
             CONVERT(observacoes3 USING utf8) as observacoes3
        from ${empresa}.produtos where codigo = ? `;
            await databaseConfig_1.conn.query(sql, [codigo], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    async buscaPorCodigoDescricao(empresa, codigo, descricao) {
        if (!codigo)
            codigo = 0;
        if (!descricao)
            descricao = '';
        const sql = `SELECT *, 
                  CONVERT(observacoes1 USING utf8) as observacoes1,
                  CONVERT(observacoes2 USING utf8) as observacoes2,
                  CONVERT(observacoes3 USING utf8) as observacoes3

            FROM ${empresa}.produtos 
            WHERE  codigo like ? OR descricao = ?    `;
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(sql, [codigo, descricao], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async buscaGeral(empresa) {
        return new Promise(async (resolve, reject) => {
            let sql = ` select 
        *,
             CONVERT(observacoes1 USING utf8) as observacoes1,
             CONVERT(observacoes2 USING utf8) as observacoes2,
             CONVERT(observacoes3 USING utf8) as observacoes3
        from ${empresa}.produtos  `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
}
exports.Select_produtos = Select_produtos;
