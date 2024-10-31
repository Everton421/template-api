"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicosController = void 0;
const select_1 = require("../../models/servicos/select");
class ServicosController {
    async buscaGeral(req, res) {
        let empresa = req.headers.cnpj;
        let select = new select_1.Select_servicos();
        if (!empresa) {
            return res.json(400).json({ erro: "É necessario informar a empresa " });
        }
        let dbName = `\`${empresa}\``;
        let servicos;
        try {
            servicos = await select.buscaGeral(dbName);
            if (servicos.length === 0) {
                return res.status(404).json({ erro: "Nenhum servico encontrado." });
            }
            return res.status(200).json(servicos);
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({ erro: "Erro ao buscar servico." });
        }
    }
}
exports.ServicosController = ServicosController;
