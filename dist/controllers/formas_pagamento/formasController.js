"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormasController = void 0;
const select_1 = require("../../models/formas_pagamento/select");
class FormasController {
    async buscaGeral(req, res) {
        let empresa = req.headers.cnpj;
        let select = new select_1.SelectForma_pagamento();
        if (!empresa) {
            return res.json(400).json({ erro: "É necessario informar a empresa " });
        }
        let dbName = `\`${empresa}\``;
        let fpgt;
        try {
            fpgt = await select.buscaGeral(dbName);
            if (fpgt.length === 0) {
                return res.status(404).json({ erro: "Nenhuma forma de pagamento encontrada." });
            }
            return res.status(200).json(fpgt);
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar formas de pagamento." });
        }
    }
}
exports.FormasController = FormasController;
