"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const select_1 = require("../../models/produtos/select");
class ProdutoController {
    async buscaGeral(req, res) {
        let empresa = req.headers.cnpj;
        let select = new select_1.Select_produtos();
        if (!empresa) {
            return res.json(400).json({ erro: "É necessario informar a empresa " });
        }
        let dbName = `\`${empresa}\``;
        let produtos;
        try {
            produtos = await select.buscaGeral(dbName);
            if (produtos.length === 0) {
                return res.status(404).json({ erro: "Nenhum produto encontrado." });
            }
            return res.status(200).json(produtos);
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar produtos." });
        }
    }
}
exports.ProdutoController = ProdutoController;
