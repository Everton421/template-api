"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.versao = void 0;
const express_1 = require("express");
const databaseConfig_1 = require("./database/databaseConfig");
require("dotenv/config");
const produtoController_1 = require("./controllers/produtos/produtoController");
const clienteController_1 = require("./controllers/cliente/clienteController");
const empresaController_1 = require("./controllers/empresa/empresaController");
const login_1 = require("./controllers/login/login");
const usuariosController_1 = require("./controllers/usuariosController/usuariosController");
const pedidoController_1 = require("./controllers/pedido/pedidoController");
const servicosController_1 = require("./controllers/servicos/servicosController");
const formasController_1 = require("./controllers/formas_pagamento/formasController");
const tipoOsController_1 = require("./controllers/tipos_os/tipoOsController");
const crypt = require('crypt');
const router = (0, express_1.Router)();
exports.router = router;
exports.versao = '/v1';
router.get(`${exports.versao}/`, async (req, res) => {
    await databaseConfig_1.conn.getConnection(async (err) => {
        if (err) {
            return res.status(500).json({ "erro": "falha ao se conectar ao banco de dados1 " });
        }
        else {
            return res.json({ "ok": true });
        }
    });
});
router.get(`${exports.versao}/offline/produtos`, new produtoController_1.ProdutoController().buscaGeral);
router.get(`${exports.versao}/offline/clientes`, new clienteController_1.ClienteController().buscaGeral);
router.get(`${exports.versao}/offline/servicos`, new servicosController_1.ServicosController().buscaGeral);
router.get(`${exports.versao}/offline/formas_pagamento`, new formasController_1.FormasController().buscaGeral);
router.get(`${exports.versao}/offline/tipo_os`, new tipoOsController_1.TipoOsController().buscaGeral);
router.get(`${exports.versao}/pedidos`, new pedidoController_1.pedidoController().select);
router.post(`${exports.versao}/empresa`, new empresaController_1.CreateEmpresa().create);
router.post(`${exports.versao}/empresa/validacao`, new empresaController_1.CreateEmpresa().validaExistencia);
//
router.post(`${exports.versao}/login`, new login_1.Login().login);
router.post(`${exports.versao}/registrar_usuario`, new usuariosController_1.UsuariosController().cadastrar);
/////
router.post(`${exports.versao}/pedidos`, new pedidoController_1.pedidoController().insert);
