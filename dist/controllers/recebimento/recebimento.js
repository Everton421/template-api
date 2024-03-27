"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recebimento = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Recebimento {
    async busca() {
        const sql = ` SELECT * FROM ${databaseConfig_1.db_publico}.cad_fpgt;`;
        return new Promise((reject, resolve) => {
            databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log(result);
                }
            });
        });
    }
}
exports.Recebimento = Recebimento;
