"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo_de_os = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Tipo_de_os {
    async busca(request, response) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT 
                            CODIGO codigo,
                             DESCRICAO descricao,
                             EXIGIR_LAUDO exigir_laudo  
                FROM ${databaseConfig_1.db_publico}.tipos_os `;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    response.status(200).json(result);
                    resolve(result);
                }
            });
        });
    }
}
exports.Tipo_de_os = Tipo_de_os;
