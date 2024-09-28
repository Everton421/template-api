"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servicos = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Servicos {
    async busca(request, response) {
        return new Promise(async (resolve, reject) => {
            const sql = `SELECT
                CODIGO as codigo,
                TIPO_SERV as tipo_serv,
                VALOR as valor,
                APLICACAO as aplicacao            
                 
             FROM ${databaseConfig_1.db_publico}.cad_serv;`;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(response.status(200).json(result));
                }
            });
        });
    }
    async buscaPorAplicacao(request, response) {
        return new Promise(async (resolve, reject) => {
            let param = `'%${request.params.servico}%'`;
            console.log(param);
            let sql = ` SELECT 
                CODIGO as codigo,
                TIPO_SERV as tipo_serv,
                VALOR as valor,
                APLICACAO as aplicacao            
                 
             FROM ${databaseConfig_1.db_publico}.cad_serv
             WHERE aplicacao like ${param}
             limit 10
             `;
            console.log(sql);
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(response.status(500).json(err));
                }
                else {
                    resolve(response.status(200).json(result));
                }
            });
        });
    }
}
exports.Servicos = Servicos;
