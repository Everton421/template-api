import { Request, Response } from "express";
import { Insert_UsuarioEmpresa } from "../../models/usuariosEmpresa/insert";
import { Select_UsuarioEmpresa } from "../../models/usuariosEmpresa/select";
import { newUserEmpresa } from "../../models/usuariosEmpresa/interface";
import { UsuariosApi } from "../../models/usuariosApi/usuarios";

export class UsuariosController{



    async cadastrar( req:Request ,res:Response ){

        let  insertUser = new Insert_UsuarioEmpresa();
        let selectUser   = new Select_UsuarioEmpresa();
        let insertUserApi = new UsuariosApi();

             if(!req.body.email)   return res.status(400).json({erro:"É necessario informar o email do usuario "})
             if(!req.body.senha)   return res.status(400).json({erro:"É necessario informar a senha do usuario "})
             if(!req.body.usuario) return res.status(400).json({erro:"É necessario informar o nome do usuario "})

            if(!req.headers.cnpj) res.status(400).json({erro:"É necessario informar o codigo da empresa "})
                        let email = req.body.email;
                        let senha = req.body.senha;
                        let usuario = req.body.usuario;
                        let cnpj = `\`${req.headers.cnpj}\``;

                            let user:newUserEmpresa = {cnpj:cnpj, email:email, senha:senha,usuario:usuario };
        
         let validUser = await selectUser.buscaPorEmailNome(cnpj,usuario, email  );
                    if( validUser.length > 0  ){
                         return res.status(400).json({erro:`O usuario ${usuario} já foi cadastrado `})
                    }

                    
                    let userCad:any =  await insertUser.insert_usuario( req.headers.cnpj, user)
                        if(userCad.insertId > 0 ){
                            let userApi = {
                                usuario:req.body.usuario,
                                email:req.body.email,
                                cnpj:req.headers.cnpj,
                                senha:req.body.senha        
                                }

                             await insertUserApi.insertUsuario(userApi)
                            return res.status(200).json(  
                                                            {
                                                                ok:`usuario registrado com sucesso!` ,
                                                                codigo:userCad.insertId,
                                                                usuario:user.usuario,
                                                                senha:user.senha
                                                            }
                                                        )
                        }

    }
}