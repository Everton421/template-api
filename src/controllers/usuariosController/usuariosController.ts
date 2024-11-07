import { Request, response, Response } from "express";
import { Insert_UsuarioEmpresa } from "../../models/usuariosEmpresa/insert";
import { Select_UsuarioEmpresa } from "../../models/usuariosEmpresa/select";
import { newUserEmpresa } from "../../models/usuariosEmpresa/interface";
import { UsuariosApi } from "../../models/usuariosApi/usuarios";
import { newUser, UsuarioApi } from "../../models/usuariosApi/interface";

export class UsuariosController{



    async cadastrar( req:Request ,res:Response ){


        let  objInsertUser = new Insert_UsuarioEmpresa();
        let selectUserEmpresa   = new Select_UsuarioEmpresa();
        let objUserApi = new UsuariosApi();

             if(!req.body.email)   return res.status(200).json({erro:"É necessario informar o email do usuario "})
             if(!req.body.senha)   return res.status(200).json({erro:"É necessario informar a senha do usuario "})
             if(!req.body.usuario) return res.status(200).json({erro:"É necessario informar o nome do usuario "})

            if(!req.headers.cnpj) res.status(200).json({erro:"É necessario informar o cnpj da empresa "})
                        let email = req.body.email;
                        let senha = req.body.senha;
                        let usuario = req.body.usuario;
                        let cnpj = `\`${req.headers.cnpj}\``;
                        let cnpjF:any = req.headers.cnpj;

                            let user:newUserEmpresa = {cnpj:cnpjF, email:email, senha:senha,usuario:usuario , responsavel:'N'};
        
         let validUserEmpresa = await selectUserEmpresa.buscaPorEmailNome(cnpj,usuario, email  );
         let validUserApi = await objUserApi.selectPorEmail( email );

                 if( validUserEmpresa.length > 0  ){
                         return res.status(200).json({ok:false, msg:`O usuario ${email} já foi cadastrado na empresa !`})
                    }

                 if( validUserApi.length > 0  ){
                        return res.status(200).json({ ok:false, msg:`O usuario ${email} já foi cadastrado !`})
                   }
                    
                    let userCad:any =  await objInsertUser.insert_usuario( cnpj, user)
                        if(userCad.insertId > 0 ){
                            let userApi:newUser   = {
                                usuario:req.body.usuario,
                                email:req.body.email,
                                cnpj:String(req.headers.cnpj),
                                senha:req.body.senha,        
                                responsavel:'N'
                                }

                              await objUserApi.insertUsuario(userApi)
                            return res.status(200).json(  
                                                            {
                                                                ok:true ,
                                                                msg:`usuario registrado com sucesso!` ,
                                                                codigo:userCad.insertId,
                                                                usuario:user.usuario,
                                                                senha:user.senha
                                                            }
                                                        )
                        }

    }
}