"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Cliente {
    async busca(req, res) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                   SELECT 
                   CODIGO AS codigo,
                   NOME as nome,
                    CPF as cnpj,
                    RG as ie,
                    CELULAR as celular,
                    CEP as cep,
                    ENDERECO as endereco,
                    CIDADE as cidade,
                    NUMERO as numero 
                   
                   FROM ${databaseConfig_1.db_publico}.cad_clie c
                    WHERE c.CODIGO LIKE ? OR c.NOME LIKE ? OR c.CPF LIKE ?
                    limit 15
                    ;
                `;
            const reqParam = req.params.cliente;
            const param = `%${reqParam}%`;
            await databaseConfig_1.conn.query(sql, [param, param, param], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    resolve(res.json(result));
                }
            });
        });
    }
}
exports.Cliente = Cliente;
