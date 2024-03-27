"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orcamento = void 0;
class Orcamento {
    constructor(CODIGO_CLIENTE, SITUACAO, VENDEDOR, CONTATO, QTD_PARCELAS, TOTAL_ORCAMENTO, DESCONTOS, PRODUTOS = []) {
        this.PRODUTOS = [];
        this.CODIGO_CLIENTE = CODIGO_CLIENTE;
        this.SITUACAO = SITUACAO;
        this.VENDEDOR = VENDEDOR;
        this.CONTATO = CONTATO;
        this.QTD_PARCELAS = QTD_PARCELAS;
        this.TOTAL_ORCAMENTO = TOTAL_ORCAMENTO;
        this.DESCONTOS = DESCONTOS;
        this.PRODUTOS = PRODUTOS;
    }
    getOrcamento() {
        return Orcamento;
    }
}
exports.Orcamento = Orcamento;
