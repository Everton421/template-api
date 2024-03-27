
import { Produto } from "./Produto"
export class Orcamento{
    
    CODIGO_CLIENTE:Number
    SITUACAO:String
    VENDEDOR:Number
    CONTATO?:String
    QTD_PARCELAS:Number
    TOTAL_ORCAMENTO:Number
    DESCONTOS:Number
    PRODUTOS:Produto[] = []

constructor(
            CODIGO_CLIENTE:Number,
            SITUACAO:String,
            VENDEDOR:Number,
            CONTATO:String,
            QTD_PARCELAS:Number,
            TOTAL_ORCAMENTO:Number,
            DESCONTOS:Number,
            PRODUTOS:Produto[] = []
                ){

                    this.CODIGO_CLIENTE = CODIGO_CLIENTE;
                    this.SITUACAO = SITUACAO;
                    this.VENDEDOR = VENDEDOR;
                    this.CONTATO =CONTATO;
                    this.QTD_PARCELAS = QTD_PARCELAS;
                    this.TOTAL_ORCAMENTO = TOTAL_ORCAMENTO;
                    this.DESCONTOS = DESCONTOS;
                    this.PRODUTOS = PRODUTOS;
                }

            public getOrcamento(){
                    return Orcamento;
            }




        }
