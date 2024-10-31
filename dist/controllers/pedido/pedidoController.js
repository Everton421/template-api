"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidoController = void 0;
const insert_1 = require("../../models/pedido/insert");
const select_1 = require("../../models/pedido/select");
const update_1 = require("../../models/pedido/update");
const select_2 = require("../../models/cliente/select");
class pedidoController {
    async insert(req, res) {
        let insertPedido = new insert_1.CreateOrcamento();
        let selectPedido = new select_1.SelectOrcamento();
        let updatePedido = new update_1.UpdateOrcamento();
        //     console.log(req.body);
        //     console.log(req.headers);
        if (!req.headers.cnpj)
            return res.status(400).json({ erro: "É necessario informar o codigo da empresa " });
        let cnpj = `\`${req.headers.cnpj}\``;
        if (req.body.length < 0)
            return res.status(400).json({ erro: "É necessario informar os pedidos! " });
        if (req.body.length > 0) {
            let dadosPedidos = req.body;
            const results = await Promise.all(dadosPedidos.map(async (p) => {
                let validPedido;
                let status_registrado;
                validPedido = await selectPedido.validaExistencia(cnpj, p.codigo);
                if (validPedido.length > 0) {
                    let pedidoEncontrado = validPedido[0];
                    if (p.data_recadastro > pedidoEncontrado.data_recadastro) {
                        let aux = await updatePedido.update(cnpj, p, p.codigo);
                        console.log(aux);
                        return { codigo: aux, status: 'atualizado' };
                    }
                    else {
                        console.log(` o pedido ${p.codigo} se encontra atualizado com sucesso`);
                        return { codigo: p.codigo, status: ` O pedido ${p.codigo} se encontra atualizado` };
                    }
                }
                else {
                    console.log(`registrando pedido      `);
                    status_registrado = await insertPedido.create(cnpj, p);
                    return { codigo: p.codigo, status: 'inserido' };
                }
            }));
            return res.status(200).json({ results });
        }
        else {
            return res.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });
        }
    }
    async select(req, res) {
        if (!req.query.data)
            return res.status(400).json({ erro: `é necessario informar uma data` });
        if (!req.query.vendedor)
            return res.status(400).json({ erro: `é necessario informar o vendedor` });
        if (!req.headers.cnpj)
            return res.status(400).json({ erro: "É necessario informar o codigo da empresa " });
        let cnpj = `\`${req.headers.cnpj}\``;
        let vendedor = Number(req.query.vendedor);
        let data = req.query.data;
        let selectOrcamento = new select_1.SelectOrcamento();
        let insertOrcamento = new insert_1.CreateOrcamento();
        let updateOrcamento = new update_1.UpdateOrcamento();
        let select_clientes = new select_2.Select_clientes();
        let orcamentos_registrados = [];
        const dados_orcamentos = await selectOrcamento.buscaPordata(cnpj, data, vendedor);
        if (dados_orcamentos.length > 0) {
            const promises = dados_orcamentos.map(async (i) => {
                let produtos = [];
                let servicos = [];
                let parcelas = [];
                let cliente;
                try {
                    let resultCliente = await select_clientes.buscaPorcodigo(cnpj, i.cliente);
                    if (resultCliente.length === 0) {
                        cliente = {};
                    }
                    else {
                        cliente = resultCliente[0];
                    }
                }
                catch (e) {
                    console.log(`erro ao buscar os produtos do pedido ${i.codigo}`);
                }
                try {
                    produtos = await updateOrcamento.buscaProdutosDoOrcamento(cnpj, i.codigo);
                    if (produtos.length === 0)
                        produtos = [];
                }
                catch (e) {
                    console.log(`erro ao buscar os produtos do pedido ${i.codigo}`);
                }
                try {
                    servicos = await updateOrcamento.buscaServicosDoOrcamento(cnpj, i.codigo);
                    if (servicos.length === 0)
                        servicos = [];
                }
                catch (e) {
                    console.log(`erro ao buscar os servicos do pedido ${i.codigo}`);
                }
                try {
                    parcelas = await updateOrcamento.buscaParcelasDoOrcamento(cnpj, i.codigo);
                    if (parcelas.length === 0)
                        parcelas = [];
                }
                catch (e) {
                    console.log(`erro ao buscar as parcelas do pedido ${i.codigo}`);
                }
                i.produtos = produtos;
                i.servicos = servicos;
                i.parcelas = parcelas;
                i.cliente = cliente;
                console;
                orcamentos_registrados.push(i);
            });
            await Promise.all(promises);
            console.log(orcamentos_registrados);
        }
        return res.status(200).json(orcamentos_registrados);
    }
}
exports.pedidoController = pedidoController;
