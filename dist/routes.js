"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const produtos_1 = require("./controllers/produtos/produtos");
const orcamento_1 = require("./controllers/orcamento/orcamento");
const cliente_1 = require("./controllers/cliente/cliente");
const formaDePagamamento_1 = require("./controllers/formaDePagamamento/formaDePagamamento");
const acerto_1 = require("./controllers/acerto/acerto");
const databaseConfig_1 = require("./database/databaseConfig");
const usuario_1 = require("./controllers/usuario/usuario");
require("dotenv/config");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', async (req, res) => {
    await databaseConfig_1.conn.getConnection(async (err) => {
        if (err) {
            return res.status(500).json({ "erro": "falha ao se conectar ao banco de dados1 " });
        }
        else {
            return res.json({ "ok": true });
        }
    });
});
router.post('/teste', (req, res) => {
    //return res.json(req.headers)
    console.log(req.body);
    if (req.body) {
        return res.status(200);
    }
    //      console.log(req.headers);
});
/*------------------------ rota de login -------------------*/
function checkToken(req, res, next) {
    const header = req.headers['authorization'];
    const token = header && header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "acesso negado" });
    }
    const secret = process.env.SECRET;
    if (token === secret) {
        next();
    }
    else {
        res.status(400).json({ msg: "token invalido" });
    }
}
router.post('/auth', async (req, res) => {
    const { nome, senha } = req.body;
    console.log(req.body);
    if (!nome) {
        res.status(500).json({ "error": "usuario não informado" });
    }
    if (!senha) {
        res.status(500).json({ "error": "senha não informada" });
    }
    const obj = new usuario_1.Usuario();
    const aux = await obj.usuarioSistema(databaseConfig_1.conn, databaseConfig_1.db_publico, nome, senha);
    console.log(aux);
    if (!aux) {
        res.status(500).json({ "error": "usuario invalido" });
    }
    if (aux) {
        res.status(200).json({ "usuario": aux.nome });
    }
});
router.get('/produtos/:produto', checkToken, async (req, res) => {
    const a = new produtos_1.produto();
    const aux = await a.busca(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux);
});
/* ------------------ rotas acerto -------------------------- */
//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo 
router.get('/acerto/produto/:produto', checkToken, async (req, res) => {
    const obj = new produtos_1.produto();
    const aux = await obj.buscaDoAcerto(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux[0]);
});
//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto
router.get('/acerto/produtos/:produto', checkToken, async (req, res) => {
    const a = new produtos_1.produto();
    const aux = await a.busca(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux);
});
//  busca setores do sistema 
router.get('/acerto/setores/', checkToken, async (req, res) => {
    const a = new produtos_1.produto();
    const aux = await a.buscaSetores(databaseConfig_1.conn, databaseConfig_1.db_estoque, req, res);
    res.json(aux);
});
//busca produto no setor
router.get('/acerto/produtoSetor/:produto', checkToken, async (req, res) => {
    const codigo = req.params.produto;
    console.log(codigo);
    const a = new produtos_1.produto();
    const aux = await a.prodSetorQuery(databaseConfig_1.conn, codigo, databaseConfig_1.db_estoque);
    res.json(aux);
});
//busca preco do produto
router.get('/acerto/produtoPreco/:produto', checkToken, async (req, res) => {
    const codigo = req.params.produto;
    console.log(codigo);
    const a = new produtos_1.produto();
    const aux = await a.tabelaPrecosQuery(databaseConfig_1.conn, codigo, databaseConfig_1.db_publico);
    res.json(aux);
});
//            recebe acerto de estoque
router.post('/acerto', checkToken, async (req, res) => {
    const json = req.body;
    const obj = new acerto_1.Acerto();
    try {
        await obj.insereAcerto(req, res, json, databaseConfig_1.db_estoque);
    }
    catch (err) {
        console.log(err);
    }
});
/* ------------------------------------------------------------ */
/* clientes */
//router.get('/clientes/:cliente', async ()=> await new Cliente().busca);
const cliente = new cliente_1.Cliente();
const fpgt = new formaDePagamamento_1.formaDePagamamento();
router.get('/clientes/:cliente', cliente.busca);
router.get('/formas_Pagamento/', checkToken, async (req, res) => {
    await fpgt.busca(req, res);
});
router.post('/orcamentos', checkToken, new orcamento_1.controlerOrcamento().cadastra);
router.put('/orcamentos', checkToken, new orcamento_1.controlerOrcamento().atualizaOrcamento);
router.get('/orcamentos/diario/:filtro', checkToken, new orcamento_1.controlerOrcamento().buscaOrcamentosDoDia);
router.get('/orcamentos/:codigo', checkToken, new orcamento_1.controlerOrcamento().buscaPorCodigo);
