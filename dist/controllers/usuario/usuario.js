"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    async usuarioSistema(conexao, dbpublico, nome, senha) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT APELIDO AS nome , SENHA_WEB AS senha  FROM  ${dbpublico}.cad_vend 
                WHERE APELIDO = ? AND SENHA_WEB = ?;
            `;
            await conexao.query(sql, [nome, senha], (err, result) => {
                if (err) {
                    reject(err);
                }
                {
                    resolve(result[0]);
                }
            });
        });
    }
}
exports.Usuario = Usuario;
