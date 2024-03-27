"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Cliente {
    async busca(req) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                   SELECT * FROM space_publico.cad_clie c
                    WHERE c.CODIGO LIKE ? OR c.NOME LIKE ? OR c.CPF LIKE ?
                    LIMIT 10 ;
                `;
            const reqParam = req.params.cliente;
            const param = `%${reqParam}%`;
            await databaseConfig_1.conn.query(sql, [param, param, param], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.Cliente = Cliente;
