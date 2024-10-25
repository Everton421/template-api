import { Request, response, Response } from "express";
import   { conn} from '../../database/databaseConfig'  
import { UsuarioApi } from "../../models/usuariosApi/interface";
import { UsuariosApi } from "../../models/usuariosApi/usuarios";
import { Insert_UsuarioEmpresa } from "../../models/usuariosEmpresa/insert";
 

export class CreateEmpresa{

 
  async create(    request:Request, response:Response){

    type newUser = Omit<UsuarioApi , "codigo"> 

        let obj = new CreateEmpresa();
        let objUsuariosApi = new UsuariosApi();
        let objInertUserEmpresa = new Insert_UsuarioEmpresa();

        let dbName;
        let cnpj:string = request.body.cnpj
        let usuario:string =    String(request.body.usuario);
        let email:string = request.body.email
        let senha:string = request.body.senha


            let objUser:newUser = { usuario, email, cnpj, senha};

        if( !cnpj ){  return response.json({erro:"nao informado o cnpj da empresa "})
        }else{
          dbName = `\`${cnpj}\``;
         }

        if( !usuario )   return response.json({erro:"nao informado o usuario da empresa "})
        if( !senha )   return response.json({erro:`nao foi informado a senha para o usuario ${ usuario} da empresa `})

 
         
let produtos = `\`${'produtos'}\``
      
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
        data_cadastro TEXT NOT NULL,
        data_recadastro TEXT NOT NULL, 
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
        data_cadastro TEXT NOT NULL,
        data_recadastro TEXT NOT NULL,
        vendedor INTEGER NOT NULL DEFAULT 0
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
        data_cadastro TEXT NOT NULL,
        data_recadastro TEXT NOT NULL,
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
        vencimento TEXT NOT NULL DEFAULT '0000-00-00'
    );`,
    `CREATE TABLE IF NOT EXISTS ${dbName}.usuarios (
        codigo  int(10)  NOT NULL AUTO_INCREMENT,
        nome TEXT NOT NULL,
        senha TEXT NOT NULL,
        email varchar(255),
        cnpj varchar(255),
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

       
        let sql =  ` create database if not exists  ${dbName}  ;  `;

            let valid = await obj.consulta_empresas(cnpj);
        console.log(valid)
             if(valid === true ){
                   console.log(` a empresa com o cnpj ${cnpj } ja foi cadastrada!`);

                sqlTables.forEach( async (e)=>{
                      await conn.query( e ,( err, result )=>{
                         if(err) throw err;
                            else console.log(`tabela registrada com sucesso!`)
                         })

                   })

                   return  response.status(400).json({erro:` a empresa com o cnpj ${cnpj } ja foi cadastrada!`})  ;

             }else{
                 await  conn.query(sql  , async ( err, result )=>{
                     if( err ) console.log(err);
                     else
                         if(result.affectedRows > 0 ){
                            sqlTables.forEach( async (e)=>{
                                await conn.query( e , async ( err, result )=>{
                                    if(err) throw err
                                    else console.log(`tabela registrada com sucesso!`)
                                     })
                               })   
                                   
                               let validUserApi:UsuarioApi[] = await objUsuariosApi.selectPorEmail(objUser.email);
                                    if (validUserApi.length > 0 )  return response.status(400).json({erro:` Já existe usuario cadastro com este email ${objUser.email }`})  ;

                               let userRegister:any = await objUsuariosApi.insertUsuario(objUser)
                               console.log(userRegister)
                                
                                if( userRegister.insertId > 0 ){
                                    await objInertUserEmpresa.insert_usuario(dbName,objUser);
                                    return  response.status(200).json({  empresa:`Empresa ${cnpj } registrada com sucesso ! `, usuario:` Usuario ${objUser.usuario} registrado com sucesso!`});
                                }else{

                                    let resultDeleteEmpresa:any = await obj.delete_empresa(dbName);
                                    if( resultDeleteEmpresa.affectedRows > 0 ){
                                          return  response.status(400).json({erro:` ocorreu um erro ao registrar a empresa ${cnpj }`}) ;

                                    }
                                }

                         }
                     })
          }   
 
    } 



    async consulta_empresas ( empresa:string ){
        return new Promise<boolean>( async ( resolve, reject)=>{
            await conn.query(`SHOW DATABASES`,(err, result)=>{
                if(err) reject(err);
                else
                    if( result.length > 0 ){
                     let valid = result.some(( e:any ) => e.Database === empresa   );
                        resolve(valid)
                    }
            })
        })
    }

async delete_empresa( empresa:string ){
    return new Promise<boolean>( async ( resolve, reject)=>{
        await conn.query(`DROP DATABASE ${empresa}`,(err, result)=>{
            if(err) reject(err);
            else
            console.log(result);
               // if( result.length > 0 ){
               //  let valid = result.some(( e:any ) => e.Database === empresa   );
               //     resolve(valid)
               // }
        })
    })
}


}
