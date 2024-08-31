"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formaDePagamamento = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class formaDePagamamento {
    async busca(req, res) {
        const sql = ` SELECT 
                    CODIGO as codigo,
                    DESCRICAO as descricao,
                    DESC_MAXIMO as desc_maximo,
                    NUM_PARCELAS as parcelas,
                    INTERVALO as intervalo,
                    TIPO_RECEBIMENTO AS recebimento
                    FROM ${databaseConfig_1.db_publico}.cad_fpgt;`;
        return new Promise((reject, resolve) => {
            databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    res.json(result);
                }
            });
        });
    }
}
exports.formaDePagamamento = formaDePagamamento;
