import { Request, Response } from "express";
import { Insert_UsuarioEmpresa } from "../../models/usuariosEmpresa/insert";
import { Select_UsuarioEmpresa } from "../../models/usuariosEmpresa/select";
import { newUserEmpresa } from "../../models/usuariosEmpresa/interface";

export class UsuariosController{



    async cadastrar( req:Request ,res:Response ){

        let  insertUser = new Insert_UsuarioEmpresa();
        let selectUser   = new Select_UsuarioEmpresa();
        

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

                    
                    let userCad:any =  await insertUser.insert_usuario(cnpj, user)
                        if(userCad.insertId > 0 ){
                            console.log(userCad.insertId);
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