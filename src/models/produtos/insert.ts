import { conn } from "../../database/databaseConfig"
import { Produto } from "./interface_produto";

export class InsertProdutos{

    async insert ( empresa:any, produto:Produto){

        let {
            codigo,
            ativo,
            class_fiscal,
            cst,
            data_cadastro,
            data_recadastro,
            descricao,
            estoque,
            grupo,
            marca,
            num_original,
            origem,
            preco,
            sku,
            tipo,
            num_fabricante,
            observacoes1,
            observacoes2,
            observacoes3,
                        }= produto
        return new Promise( async  ( resolve, reject ) =>{

const sql =`

INSERT INTO  ${empresa}.produtos  
( 
codigo,
 estoque , 
 preco , 
 grupo , 
 origem , 
 descricao , 
 num_fabricante ,  
 num_original ,
 sku , 
 marca ,
 class_fiscal ,
 data_cadastro ,
 data_recadastro , 
 tipo,
 observacoes1,
 observacoes2,
 observacoes3,
     ) VALUES (  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)
`;
let dados = [codigo, estoque , preco ,  grupo , origem ,  descricao ,  num_fabricante ,   num_original , sku ,  marca ,  class_fiscal , data_cadastro , data_recadastro ,  tipo, observacoes1, observacoes2, observacoes3,]


            await conn.query(sql, [dados], (err, result )=>{
                if(err){
                    reject(err);
                }else{
                    console.log(`produto cadastrado com sucesso `)
                    resolve(result);
                }
            })
        })
    }

}