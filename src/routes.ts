import { Router,Request,Response, NextFunction } from "express";
import { conn  } from "./database/databaseConfig";
import 'dotenv/config';
//import { Orcamento_service } from "./controllers/orcamento/orcamento_service";
import { checkToken } from "./middleware/cheqtoken";
import { Select_produtos } from "./models/produtos/select";
import { ProdutoController } from "./controllers/produtos/produtoController";
import { ClienteController } from "./controllers/cliente/clienteController";
import { CreateEmpresa } from "./controllers/empresa/empresaController";
import { Login } from "./controllers/login/login";
import { UsuariosController } from "./controllers/usuariosController/usuariosController";
import { pedidoController } from "./controllers/pedido/pedidoController";
import { ServicosController } from "./controllers/servicos/servicosController";
import { FormasController } from "./controllers/formas_pagamento/formasController";
import { TipoOsController } from "./controllers/tipos_os/tipoOsController";

  const crypt = require('crypt');
  const router = Router();
  export const versao = '/v1'

    router.get(`${versao}/`, async (req:Request, res:Response)=>{
      await conn.getConnection(
        async (err:Error)=>{
          if(err){
              return res.status(500).json({"erro": "falha ao se conectar ao banco de dados1 "})
          }else{
            return  res.json({"ok":true});
          }
        }
      )
    })

 
 router.get(`${versao}/offline/produtos`,   new ProdutoController().buscaGeral )
 router.get(`${versao}/offline/clientes`,   new ClienteController().buscaGeral )
 router.get(`${versao}/offline/servicos`,   new ServicosController().buscaGeral )
 router.get(`${versao}/offline/formas_pagamento`, new FormasController().buscaGeral )
 router.get(`${versao}/offline/tipo_os`,   new TipoOsController().buscaGeral )

 router.get(`${versao}/pedidos`,    new pedidoController().select)


 router.post(`${versao}/empresa`,   new CreateEmpresa().create)

 router.post(`${versao}/login`, new Login().login)
 router.post(`${versao}/registrar_usuario`, new UsuariosController().cadastrar)
/////
 router.post(`${versao}/pedidos`, new pedidoController().insert)
////

 

/**___________ */

    export {router} 