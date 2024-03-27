"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const produtos_1 = require("./controllers/produtos/produtos");
const orcamento_1 = require("./controllers/orcamento/orcamento");
const cliente_1 = require("./controllers/cliente/cliente");
const recebimento_1 = require("./controllers/recebimento/recebimento");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (req, res) => {
    return res.json({ "ok": true });
});
router.get('/produto/:produto', async (req, res) => {
    const a = new produtos_1.produto();
    const aux = await a.busca(req, res);
    res.json(aux);
});
router.get('/cliente/:cliente', async (req, res) => {
    const obj = new cliente_1.Cliente();
    const data = await obj.busca(req);
    res.json(data);
});
router.get('/forma_pagamento', new recebimento_1.Recebimento().busca);
router.post('/cadastraOrcamento', async (req, res) => {
    const obj = new orcamento_1.controlerOrcamento();
    let a = await obj.cadastra(req, res);
});
router.post('/acerto', (req, res) => {
    const a = new produtos_1.produto();
    a.acerto(req, res, req.body);
    //console.log(req.body)
});
