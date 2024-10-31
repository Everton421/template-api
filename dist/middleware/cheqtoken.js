"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
function checkToken(req, res, next) {
    const header = req.headers['authorization'];
    const token = header && header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Acesso negado, token não informado! " });
    }
    const secret = process.env.SECRET;
    if (token === secret) {
        next();
    }
    else {
        res.status(400).json({ msg: "token invalido" });
    }
}
exports.checkToken = checkToken;
