"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Usuario {
    async usuarioSistema(conexao, dbpublico, nome, senha) {
        return new Promise(async (resolve, reject) => {
            const sql = ` SELECT APELIDO AS nome , SENHA_WEB AS senha , CODIGO as codigo  FROM  ${dbpublico}.cad_vend 
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
    async busca(request, response) {
        return new Promise(async (resolve, reject) => {
            let sql = `SELECT 
      codigo,
      senha_web,
      APELIDO AS nome ,
      data_nasc as data_nascimento,
      apelido,
      endereco,
      numero,
      bairro,
      cidade,
      estado,
      telefone,
      celular,
      email,
      cpf 
      supervisor,
    tipo,
     CASE
      WHEN tipo =  'V' THEN   'vendedor'
      WHEN tipo =  'F' THEN   'funcionario'
      WHEN tipo =  'I' THEN   'indicacao'
      WHEN tipo =  'T' THEN   'tecnico'
      else tipo 
      end as tipo_funcionario
     
    FROM ${databaseConfig_1.db_publico}.cad_vend where ATIVO = 'S';`;
            await databaseConfig_1.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(result);
                    resolve(response.json(result));
                }
            });
        });
    }
}
exports.Usuario = Usuario;
