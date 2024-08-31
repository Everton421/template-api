"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn2 = exports.db_publico2 = exports.db_vendas2 = exports.db_estoque2 = exports.db_financeiro2 = exports.conn = exports.db_financeiro = exports.db_estoque = exports.db_vendas = exports.db_publico = void 0;
require("dotenv/config");
const mysql_1 = __importDefault(require("mysql"));
/**----------------------------------------------------------------------- */
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
/*---------------------------------------------------------------------*/
const portdb2 = process.env.PORT_DB2;
const username2 = process.env.USER2;
const dbpassword2 = process.env.PASSWORD2;
const hostname2 = process.env.HOST2;
exports.db_financeiro2 = process.env.DB_FINANCEIRO2;
exports.db_estoque2 = process.env.DB_ESTOQUE2;
exports.db_vendas2 = process.env.DB_VENDAS2;
exports.db_publico2 = process.env.DB_PUBLICO2;
let port2;
if (portdb2 !== undefined) {
    port2 = parseInt(portdb2);
}
exports.conn2 = mysql_1.default.createPool({
    connectionLimit: 10,
    host: hostname2,
    user: username2,
    port: port2,
    password: dbpassword2,
});
/**---------------------------------------------------------------------- */
/*     export var estoqueSpace:string = "space_eletro_estoque";
     export var vendasSpace:string ="space_eletro_vendas";
     export var publicoSpace:string = "space_eletro_publico";
     var portSpace:number =3110;
    

    export var connSpace:any = mysql.createPool({
         connectionLimit : 10,
         host: "179.184.9.227",
         user: "intersig",
         port:portSpace,
         password: "Nileduz",
     })*/
/*---------------------------------------------------------------------*/
/**      export var estoqueEletrodigital:string = "eletrodigital_estoque";
      export var vendasEletrodigital:string ="eletrodigital_vendas";
      export var publicoEletrodigital:string = "eletrodigital_publico";
       var portEletrodigital = 3306;

       export  var connEletrodigital:any = mysql.createPool({
       connectionLimit : 10,
       host: "192.168.1.250",
       user: "root",
       port:portEletrodigital,
       password: "Nileduz",
       })
*/
/*---------------------------------------------------------------------*/
/**
export var estoqueFilialsc:string = "filialsc_estoque";
       export var vendasFilialsc:string ="filialsc_vendas";
       export var publicoFilialsc:string = "filialsc_publico";
        var portFilialsc = 3306;

        export  var connFilialsc:any = mysql.createPool({
        connectionLimit : 10,
        host: "192.168.100.106",
        user: "root",
        port:portFilialsc,
        password: "Nileduz",
        })
 */
/*---------------------------------------------------------------------*/
/**
        var estoqueDigital:string = "digital_estoque";
        var vendasDigital:string ="digital_vendas";
        var publicoDigital:string = "digital_publico";
        var portDigital = 3307;

    export    var connDigital:any = mysql.createPool({
        connectionLimit : 10,
        host: "179.184.11.220",
        user: "intersig",
        port:portDigital,
        password: "Nileduz",

        })
         */
/*---------------------------------------------------------------------*/
