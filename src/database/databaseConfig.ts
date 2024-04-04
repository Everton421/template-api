import { parse } from 'dotenv';
import 'dotenv/config';
import mysql from 'mysql';


        const hostname = process.env.HOST ;
        const portdb = process.env.PORT_DB;
        const username = process.env.USER;
        const dbpassword = process.env.PASSWORD;
        
        export const db_publico = process.env.DB_PUBLICO;
        export const db_vendas = process.env.DB_VENDAS;
        export const db_estoque = process.env.DB_ESTOQUE;
        export const db_financeiro = process.env.DB_FINANCEIRO;

        let port:any | undefined;

        if(portdb !== undefined){
            port  = parseInt(portdb);
        }

       export const conn =   mysql.createPool({
            connectionLimit : 10,
            host: hostname,
            user: username,
            port: port,
            password: dbpassword,
        })

/*---------------------------------------------------------------------*/ 
        
        export var estoqueSpace:string = "space_eletro_estoque";
        export var vendasSpace:string ="space_eletro_vendas";
        export var publicoSpace:string = "space_eletro_publico";
        var portSpace:number =3110; 
       

       export var connSpace:any = mysql.createPool({
            connectionLimit : 10,
            host: "179.184.9.227",
            user: "intersig",
            port:portSpace,
            password: "Nileduz",
        })

/*---------------------------------------------------------------------*/ 
    
       export var estoqueEletrodigital:string = "eletrodigital_estoque";
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

/*---------------------------------------------------------------------*/ 
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

/*---------------------------------------------------------------------*/ 

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
/*---------------------------------------------------------------------*/ 
