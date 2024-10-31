"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosApi = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class UsuariosApi {
    async insertUsuario(usuario) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                        INSERT INTO ${databaseConfig_1.db_api}.usuarios
                        (
                            nome, email, cnpj, senha
                        ) values( ?, ?, ?, ? )
                    `;
            await databaseConfig_1.conn.query(sql, [usuario.usuario, usuario.email, usuario.cnpj, usuario.senha], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    async selectPorNome(nome) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                    select * from ${databaseConfig_1.db_api}.usuarios where nome = ?
                `;
            await databaseConfig_1.conn.query(sql, [nome], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    async selectPorEmail(email) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                select * from ${databaseConfig_1.db_api}.usuarios where email = ?
            `;
            await databaseConfig_1.conn.query(sql, [email], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    async selectPorEmailSenha(email, senha) {
        return new Promise(async (resolve, reject) => {
            let sql = `
                select * from ${databaseConfig_1.db_api}.usuarios where email = ? and senha = ? 
            `;
            await databaseConfig_1.conn.query(sql, [email, senha], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
}
exports.UsuariosApi = UsuariosApi;
