"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmpresa = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
const usuarios_1 = require("../../models/usuariosApi/usuarios");
const insert_1 = require("../../models/usuariosEmpresa/insert");
const insert_2 = require("../../models/empresa/insert");
class CreateEmpresa {
    async create(request, response) {
        let obj = new CreateEmpresa();
        let objUsuariosApi = new usuarios_1.UsuariosApi();
        let objInertUserEmpresa = new insert_1.Insert_UsuarioEmpresa();
        let insert_empresa = new insert_2.Insert_empresa();
        let dbName;
        let cnpj = request.body.cnpj;
        let usuario = String(request.body.usuario);
        let email = request.body.email;
        let senha = request.body.senha;
        let email_empresa = request.body.email_empresa;
        let nome_empresa = request.body.nome_empresa;
        let telefone_empresa = request.body.telefone_empresa;
        let objUser = { usuario, email, cnpj, senha };
        if (!cnpj) {
            return response.json({ msg: "nao informado o cnpj da empresa " });
        }
        else {
            dbName = `\`${cnpj}\``;
        }
        if (!usuario)
            return response.json({ msg: "nao informado o usuario da empresa " });
        if (!senha)
            return response.json({ msg: `nao foi informado a senha para o usuario ${usuario} da empresa ` });
        let validUserApi = await objUsuariosApi.selectPorEmail(objUser.email);
        if (validUserApi.length > 0)
            return response.status(400).json({ msg: ` Já existe usuario cadastro com este email ${objUser.email}` });
        const sqlTables = [
            `CREATE TABLE IF NOT EXISTS ${dbName}.produtos (
        codigo INTEGER PRIMARY KEY NOT NULL,
        id int(10) unsigned NOT NULL DEFAULT 0,
        estoque REAL DEFAULT 0,
        preco REAL DEFAULT 0,
        grupo INTEGER DEFAULT 0,
        origem TEXT,   
        descricao TEXT NOT NULL,
        num_fabricante TEXT,
        num_original TEXT,
        sku TEXT,
        marca INTEGER DEFAULT 0,
        ativo TEXT DEFAULT 'S',
        class_fiscal TEXT,
        cst TEXT DEFAULT '00',
        data_recadastro  datetime DEFAULT NULL,
        data_cadastro date NOT NULL DEFAULT '0000-00-00',
        observacoes1 BLOB,
        observacoes2 BLOB,
        observacoes3 BLOB,
        tipo TEXT
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.servicos (
        codigo INTEGER PRIMARY KEY NOT NULL,
        valor REAL DEFAULT 0,
        aplicacao TEXT NOT NULL,
        tipo_serv INTEGER DEFAULT 0
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.clientes (
        codigo INTEGER PRIMARY KEY NOT NULL,
        id int(10) unsigned NOT NULL DEFAULT 0,
        celular TEXT,
        nome TEXT NOT NULL,
        cep TEXT NOT NULL DEFAULT '00000-000',
        endereco TEXT,
        ie TEXT,
        numero TEXT,
        cnpj TEXT,
        ativo varchar(10) DEFAULT 'S',
        cidade TEXT,
        data_cadastro date NOT NULL DEFAULT '0000-00-00', 
        data_recadastro  datetime DEFAULT NULL,
        vendedor INTEGER NOT NULL DEFAULT 0,
        bairro varchar(255) ,
        estado  char(2) 
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.forma_pagamento (
        codigo INTEGER PRIMARY KEY NOT NULL,
        id int(10) unsigned NOT NULL DEFAULT 0,
        descricao TEXT NOT NULL, 
        desc_maximo INTEGER DEFAULT 0,  
        parcelas INTEGER DEFAULT 0,  
        intervalo INTEGER DEFAULT 0,  
        recebimento INTEGER DEFAULT 0  
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.pedidos (
        codigo bigint(20)  unsigned NOT NULL DEFAULT 0,
        id int(10) unsigned NOT NULL DEFAULT 0,
        vendedor INTEGER NOT NULL DEFAULT 0,   
        situacao TEXT NOT NULL DEFAULT 'EA',
        contato TEXT,
        descontos REAL DEFAULT 0.00,
        forma_pagamento INTEGER DEFAULT 0,
        observacoes BLOB,
        quantidade_parcelas INTEGER DEFAULT 0,
        total_geral REAL DEFAULT 0.00,
        total_produtos REAL DEFAULT 0.00,
        total_servicos REAL DEFAULT 0.00,
        cliente INTEGER NOT NULL DEFAULT 0,
        veiculo INTEGER NOT NULL DEFAULT 0,
        data_cadastro date NOT NULL DEFAULT '0000-00-00',
        data_recadastro  datetime DEFAULT NULL,
        tipo_os INTEGER DEFAULT 0, 
        enviado TEXT NOT NULL DEFAULT 'N',
        tipo INTEGER NOT NULL DEFAULT 1,  
        PRIMARY KEY (codigo),
        KEY id (id) USING BTREE
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.produtos_pedido (
        pedido bigint(20) unsigned NOT NULL DEFAULT 0,
        codigo INTEGER NOT NULL,
        desconto REAL DEFAULT 0.00,
        quantidade REAL DEFAULT 0.00,
        preco REAL DEFAULT 0.00,
        total REAL DEFAULT 0.00 
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.servicos_pedido (
        pedido bigint(20) unsigned NOT NULL DEFAULT 0,
        codigo INTEGER NOT NULL,
        desconto REAL DEFAULT 0.00,
        quantidade REAL DEFAULT 0.00,
        valor REAL DEFAULT 0.00,
        total REAL DEFAULT 0.00  
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.parcelas (
        pedido bigint(20) unsigned NOT NULL DEFAULT 0,
        parcela INTEGER NOT NULL,
        valor REAL NOT NULL DEFAULT 0.00,
        vencimento date NOT NULL DEFAULT '0000-00-00' 

    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.usuarios (
        codigo  int(10)  NOT NULL AUTO_INCREMENT,
        nome TEXT NOT NULL,
        senha TEXT NOT NULL,
        email varchar(255),
        cnpj varchar(255),
        responsavel varchar(255) DEFAULT 'S',
        PRIMARY KEY (codigo) USING BTREE 
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.tipos_os (
        codigo INTEGER PRIMARY KEY NOT NULL,
        descricao TEXT NOT NULL 
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.veiculos (
        codigo INTEGER PRIMARY KEY NOT NULL,
        id int(10) unsigned NOT NULL DEFAULT 0,
        cliente INTEGER NOT NULL DEFAULT 0,
        placa TEXT NOT NULL,
        marca INTEGER NOT NULL DEFAULT 0,
        modelo INTEGER NOT NULL DEFAULT 0,
        ano TEXT NOT NULL,
        cor INTEGER NOT NULL DEFAULT 0,
        combustivel TEXT NOT NULL 
    );`,
            `CREATE TABLE IF NOT EXISTS ${dbName}.api_config (
        codigo INTEGER PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        porta INTEGER NOT NULL DEFAULT 3000,
        token TEXT NOT NULL 
    );`
        ];
        let sql = ` create database if not exists  ${dbName}  ;  `;
        let valid = await obj.consulta_empresas(cnpj);
        console.log(valid);
        if (valid === true) {
            console.log(` a empresa com o cnpj ${cnpj} ja foi cadastrada!`);
            sqlTables.forEach(async (e) => {
                await databaseConfig_1.conn.query(e, (err, result) => {
                    if (err)
                        throw err;
                    // else console.log(`tabela registrada com sucesso!`)
                });
            });
            return response.status(400).json({ erro: ` a empresa com o cnpj ${cnpj} ja foi cadastrada!` });
        }
        else {
            await databaseConfig_1.conn.query(sql, async (err, result) => {
                if (err)
                    console.log(err);
                else if (result.affectedRows > 0) {
                    sqlTables.forEach(async (e) => {
                        await databaseConfig_1.conn.query(e, async (err, result) => {
                            if (err)
                                throw err;
                            else
                                console.log(`tabela registrada com sucesso!`);
                        });
                    });
                    let codigoUsuario;
                    let userRegister = await objUsuariosApi.insertUsuario(objUser);
                    let codigoEmpresa;
                    if (userRegister.insertId > 0) {
                        let objEmpresa = {
                            "responsavel": userRegister.insertId,
                            "cnpj": cnpj,
                            "nome_empresa": nome_empresa,
                            "email_empresa": email_empresa,
                            "telefone_empresa": telefone_empresa
                        };
                        codigoEmpresa = await insert_empresa.registrar_empresa(objEmpresa);
                    }
                    if (userRegister.insertId > 0) {
                        codigoUsuario = await objInertUserEmpresa.insert_usuario(dbName, objUser);
                        //return  response.status(200).json({  empresa:`Empresa ${cnpj } registrada com sucesso ! `, usuario:` Usuario ${objUser.usuario} registrado com sucesso!`});
                        return response.status(200).json({
                            "codigo_usuario": codigoUsuario.insertId,
                            "usuario": usuario,
                            "senha": senha,
                            "cnpj": cnpj,
                            "nome_empresa": nome_empresa, "email_empresa": email_empresa,
                            "email_usuario": email,
                            "codigo_empresa": codigoEmpresa.insertId
                        });
                    }
                    else {
                        let resultDeleteEmpresa = await obj.delete_empresa(dbName);
                        if (resultDeleteEmpresa.affectedRows > 0) {
                            return response.status(400).json({ msg: ` ocorreu um erro ao registrar a empresa ${cnpj}` });
                        }
                    }
                }
            });
        }
    }
    async validaExistencia(request, response) {
        let obj = new CreateEmpresa();
        let cnpj = request.body.cnpj;
        let valid = await obj.consulta_empresas(cnpj);
        if (valid === true) {
            let dados = await obj.consulta_dados_empresa(cnpj);
            let nome_empresa;
            let telefone_empresa;
            let email_empresa;
            let cnpj_empresa;
            if (dados.length > 0) {
                cnpj_empresa = dados[0].cnpj;
                email_empresa = dados[0].email;
                telefone_empresa = dados[0].telefone;
                nome_empresa = dados[0].nome;
            }
            console.log(` a empresa com o cnpj ${cnpj} ja foi cadastrada!`);
            return response.status(200).json({ "cadastrada": true, "msg": `Já existe uma empresa cadastrada com este cnpj !`,
                cnpj: cnpj_empresa,
                email_empresa: email_empresa,
                telefone_empresa: telefone_empresa,
                nome: nome_empresa
            });
        }
        else {
            return response.status(200).json({ "cadastrada": false, "msg": `Não encontramos empresa cadastrada com este cnpj!` });
        }
    }
    async consulta_empresas(empresa) {
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(`SHOW DATABASES`, (err, result) => {
                if (err)
                    reject(err);
                else if (result.length > 0) {
                    let valid = result.some((e) => e.Database === empresa);
                    resolve(valid);
                }
            });
        });
    }
    async consulta_dados_empresa(empresa) {
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(`select * from ${databaseConfig_1.db_api}.empresas where cnpj = ${empresa}`, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    async delete_empresa(empresa) {
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(`DROP DATABASE ${empresa}`, (err, result) => {
                if (err)
                    reject(err);
                else
                    console.log(result);
                // if( result.length > 0 ){
                //  let valid = result.some(( e:any ) => e.Database === empresa   );
                //     resolve(valid)
                // }
            });
        });
    }
}
exports.CreateEmpresa = CreateEmpresa;
