"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orcamento_service = void 0;
const orcamento_1 = require("./orcamento");
class Orcamento_service {
    async cadastra(request, response) {
        const controller = new orcamento_1.controlerOrcamento();
        const dados_orcamentos = request.body;
        if (dados_orcamentos.length > 0) {
            // Usando Promise.all para aguardar todas as promessas
            const results = await Promise.all(dados_orcamentos.map(async (i) => {
                const aux = await controller.validaOrcamento(i.codigo, i.vendedor);
                if (aux.length > 0) {
                    console.log('Já existe um orçamento registrado com o código', i.codigo);
                    await controller.update(i);
                    return { codigo: i.codigo, status: 'atualizado' };
                }
                else {
                    const result = await controller.create(i);
                    return { codigo: result, status: 'inserido' };
                }
            }));
            // Responde após todos os orçamentos terem sido processados
            return response.status(200).json({ results });
        }
        return response.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });
    }
}
exports.Orcamento_service = Orcamento_service;
