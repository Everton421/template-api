"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const insert_1 = require("../../models/usuariosEmpresa/insert");
const select_1 = require("../../models/usuariosEmpresa/select");
class UsuariosController {
    async cadastrar(req, res) {
        let insertUser = new insert_1.Insert_UsuarioEmpresa();
        let selectUser = new select_1.Select_UsuarioEmpresa();
        if (!req.body.email)
            return res.status(400).json({ erro: "É necessario informar o email do usuario " });
        if (!req.body.senha)
            return res.status(400).json({ erro: "É necessario informar a senha do usuario " });
        if (!req.body.usuario)
            return res.status(400).json({ erro: "É necessario informar o nome do usuario " });
        if (!req.headers.cnpj)
            res.status(400).json({ erro: "É necessario informar o codigo da empresa " });
        let email = req.body.email;
        let senha = req.body.senha;
        let usuario = req.body.usuario;
        let cnpj = `\`${req.headers.cnpj}\``;
        let user = { cnpj: cnpj, email: email, senha: senha, usuario: usuario };
        let validUser = await selectUser.buscaPorEmailNome(cnpj, usuario, email);
        if (validUser.length > 0) {
            return res.status(400).json({ erro: `O usuario ${usuario} já foi cadastrado ` });
        }
        let userCad = await insertUser.insert_usuario(cnpj, user);
        if (userCad.insertId > 0) {
            console.log(userCad.insertId);
            return res.status(200).json({
                ok: `usuario registrado com sucesso!`,
                codigo: userCad.insertId,
                usuario: user.usuario,
                senha: user.senha
            });
        }
    }
}
exports.UsuariosController = UsuariosController;