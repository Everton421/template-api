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
const tipo_de_os_1 = require("./controllers/tipo_de_os/tipo_de_os");
const servicos_1 = require("./controllers/servi\u00E7os/servicos");
const veiculo_1 = require("./controllers/veiculo/veiculo");
const orcamento_service_1 = require("./controllers/orcamento/orcamento_service");
const crypt = require('crypt');
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
    console.log(req.body);
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
        res.status(200).json({ "codigo": aux.codigo, "nome": aux.nome });
    }
});
router.get('/produtos/:produto', checkToken, async (req, res) => {
    const a = new produtos_1.controllerProduto();
    const aux = await a.busca(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux);
});
/* ------------------ rotas acerto -------------------------- */
//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo 
router.get('/acerto/produto/:produto', checkToken, async (req, res) => {
    const obj = new produtos_1.controllerProduto();
    const aux = await obj.buscaDoAcerto(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux[0]);
});
//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto
router.get('/acerto/produtos/:produto', checkToken, async (req, res) => {
    const a = new produtos_1.controllerProduto();
    const aux = await a.busca(databaseConfig_1.conn, req, res, databaseConfig_1.db_estoque, databaseConfig_1.db_publico);
    res.json(aux);
});
//  busca setores do sistema 
router.get('/acerto/setores/', checkToken, async (req, res) => {
    const a = new produtos_1.controllerProduto();
    const aux = await a.buscaSetores(databaseConfig_1.conn, databaseConfig_1.db_estoque, req, res);
    res.json(aux);
});
//busca produto no setor
router.get('/acerto/produtoSetor/:produto', checkToken, async (req, res) => {
    const codigo = req.params.produto;
    console.log(codigo);
    const a = new produtos_1.controllerProduto();
    const aux = await a.prodSetorQuery(databaseConfig_1.conn, codigo, databaseConfig_1.db_estoque);
    res.json(aux);
});
//busca preco do produto
router.get('/acerto/produtoPreco/:produto', checkToken, async (req, res) => {
    const codigo = req.params.produto;
    console.log(codigo);
    const a = new produtos_1.controllerProduto();
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
const tipo_os = new tipo_de_os_1.Tipo_de_os();
router.get('/clientes', cliente.buscaCompleta);
router.get('/offline/clientes', cliente.buscaCompleta);
router.get('/formas_Pagamento/', checkToken, async (req, res) => {
    await fpgt.busca(req, res);
});
//router.post('/orcamentos',checkToken,  new controlerOrcamento().cadastra);
//router.put('/orcamentos',checkToken,  new controlerOrcamento().atualizaOrcamento);
router.get('/orcamentos/diario', checkToken, new orcamento_1.controlerOrcamento().buscaOrcamentosDoDia);
router.get('/orcamentos/:codigo', checkToken, new orcamento_1.controlerOrcamento().buscaPorCodigo);
router.get('/tipos_os', checkToken, new tipo_de_os_1.Tipo_de_os().busca);
router.get('/offline/tipos_os', checkToken, new tipo_de_os_1.Tipo_de_os().busca);
router.get('/servicos/:servico', checkToken, new servicos_1.Servicos().buscaPorAplicacao);
router.get('/offline/servicos', checkToken, new servicos_1.Servicos().busca);
router.get('/usuarios', checkToken, new usuario_1.Usuario().busca);
router.get('/veiculos/:veiculo', checkToken, new veiculo_1.Veiculo().busca);
/**___________ */
router.get('/offline/produtos', checkToken, async (req, res) => {
    let obj = new produtos_1.controllerProduto();
    let aux = await obj.buscaCompleta();
    res.json(aux);
});
router.get('/offline/veiculos', checkToken, new veiculo_1.Veiculo().buscaTodos);
router.post('/orcamentos/v1', checkToken, new orcamento_service_1.Orcamento_service().cadastra);
