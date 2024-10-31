"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const https = require('https');
const fs = require('fs');
require("dotenv/config");
const swagger_json_1 = __importDefault(require("./swagger.json"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Configuração do CORS
const corsOptions = {
    origin: '*', // Permitir todas as origens. Para maior segurança, considere especificar as origens permitidas.
    methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'Authorization'],
    credentials: true, // Permitir credenciais
};
app.use((0, cors_1.default)(corsOptions));
app.use(`${routes_1.versao}/api-docs`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(express_1.default.json());
app.use(routes_1.router);
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }
    res.status(500).json({
        status: 'error ',
        messsage: 'internal server error.'
    });
});
const PORT_API = process.env.PORT_API; // Porta padrão para HTTPS
app.listen(PORT_API, () => { console.log(`app rodando porta ${PORT_API}  `); });
