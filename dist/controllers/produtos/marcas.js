"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marcas = void 0;
class Marcas {
    async buscaMarcas(conexao, dbpublico, req, res) {
        const consulta = req.params.marca;
        const marca = `%${consulta}%`;
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT CODIGO codigo, DESCRICAO descricao  
            FROM ${dbpublico}.cad_pmar WHERE DESCRICAO LIKE ? LIMIT 1`;
            await conexao.query(sql, [marca], (err, result) => {
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
exports.Marcas = Marcas;
