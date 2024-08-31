"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grupo = void 0;
class Grupo {
    async buscaGrupo(conexao, dbpublico, req, res) {
        const consulta = req.params.grupo;
        const grupo = `%${consulta}%`;
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT CODIGO codigo, NOME nome  
            FROM ${dbpublico}.cad_pgru WHERE NOME LIKE ? LIMIT 1`;
            await conexao.query(sql, [grupo], (err, result) => {
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
exports.Grupo = Grupo;
