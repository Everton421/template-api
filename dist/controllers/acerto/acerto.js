"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Acerto = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class Acerto {
    async insereAcerto(req, res, json, dbestoque) {
        const { setor, codigo, estoque } = json;
        if (!setor) {
            return res.json({ msg: "não informado o setor!" });
        }
        if (!codigo) {
            return res.json({ msg: "não informado o Produto!" });
        }
        if (!estoque) {
            return res.json({ msg: "não informado o novo saldo!" });
        }
        try {
            const sql2 = `INSERT INTO ${dbestoque}.prod_setor  ( SETOR, PRODUTO, ESTOQUE)
                              VALUES (?,?,?) ON DUPLICATE KEY UPDATE ESTOQUE = ${estoque}
                              `;
            await databaseConfig_1.conn.query(sql2, [setor, codigo, estoque], (err, result) => {
                if (err) {
                    res.status(500).json({ msg: "erro ao atualizar" });
                    console.log(err);
                }
                else {
                    res.status(200).json({ "ok": `produto ${codigo} atualizado` });
                }
            });
        }
        catch (error) {
            //console.log("erro ao buscar produto:", error);
            res.status(500).json({ err: "erro ao atualizar produto" });
        }
    }
}
exports.Acerto = Acerto;
