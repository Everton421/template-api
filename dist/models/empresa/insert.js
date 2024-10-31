"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insert_empresa = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Insert_empresa {
    async registrar_empresa(obj) {
        return new Promise(async (resolve, reject) => {
            let { responsavel, cnpj, nome_empresa, email_empresa, telefone_empresa, id } = obj;
            if (!id)
                id = 0;
            const sql = ` INSERT INTO ${databaseConfig_1.db_api}.empresas (  id, responsavel, cnpj , nome, email, telefone ) VALUES ( ?, ?, ?, ?, ?, ?) `;
            let dados = [id, responsavel, cnpj, nome_empresa, email_empresa, telefone_empresa];
            await databaseConfig_1.conn.query(sql, dados, (error, resultado) => {
                if (error) {
                    reject(" erro ao cadastrar empresa  " + error);
                }
                else {
                    resolve(resultado);
                    console.log(`empresa  inserida com sucesso`);
                }
            });
        });
    }
}
exports.Insert_empresa = Insert_empresa;
