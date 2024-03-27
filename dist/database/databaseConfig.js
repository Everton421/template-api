"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = exports.db_financeiro = exports.db_estoque = exports.db_vendas = exports.db_publico = void 0;
require("dotenv/config");
const mysql_1 = __importDefault(require("mysql"));
const hostname = process.env.HOST;
const portdb = process.env.PORT_DB;
const username = process.env.USER;
const dbpassword = process.env.PASSWORD;
exports.db_publico = process.env.DB_PUBLICO;
exports.db_vendas = process.env.DB_VENDAS;
exports.db_estoque = process.env.DB_ESTOQUE;
exports.db_financeiro = process.env.DB_FINANCEIRO;
let port;
if (portdb !== undefined) {
    port = parseInt(portdb);
}
exports.conn = mysql_1.default.createPool({
    connectionLimit: 10,
    host: hostname,
    user: username,
    port: port,
    password: dbpassword,
});
exports.conn;
const t = {
    "porta": port,
    "host": hostname,
    "username": username,
    "senha": dbpassword
};
//console.log(t)
/*

import 'dotenv/config'
const mysql = require('mysql')

    const hostname = process.env.HOST
    const portdb = process.env.PORT_DB
    const username = process.env.USER
    const dbpassword = process.env.PASSWORD

    export  var publico = "galvotelhas_publico"//process.env.DATABASE_PUBLICO;
        export var estoque = "galvotelhas_estoque"//process.env.DATABSE_ESTOQUE;
        export var vendas = "galvotelhas_vendas"//process.env.DATABSE_VENDAS;
        export       var financeiro ="galvotelhas_financeiro"// process.env.DATABSE_FINANCEIRO;

export var teste='teste';


  export var con:any = mysql.createPool({
            connectionLimit : 10,
            host: hostname,
            user: username,
            port: portdb,
            password: dbpassword,
            database: estoque,
            database2: publico,
            database3: vendas,
        })


///export {con,vendas,publico,estoque,financeiro}



*/ 
