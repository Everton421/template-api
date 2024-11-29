import { conn } from "../../database/databaseConfig"

export class InsertProdutos{

    async insert ( empresa:any, produto:any){

     //   return new Promise( async ( resolve, reject)=>{
//
//
     //   }))

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
                observacoes3   } = produto

                const sql =` INSERT INTO  ${empresa}.produtos  
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
                            observacoes3
                                ) VALUES (
                                    ${codigo},
                                    ${estoque} ,
                                    ${preco} ,
                                    ${grupo} ,
                                    ${origem} ,
                                    '${descricao}',
                                    '${num_fabricante}' ,
                                    '${num_original}' ,
                                    '${sku}' ,
                                    ${marca} ,
                                    '${class_fiscal}',
                                    '${data_cadastro}',
                                    '${data_recadastro}',  
                                    ${tipo}, 
                                    '${observacoes1}',
                                    '${observacoes2}',
                                    '${observacoes3}'  
                                  )
                            `;


                let dados = [codigo, estoque , preco ,  grupo , origem ,  descricao ,  num_fabricante ,   num_original , sku ,  marca ,  class_fiscal , data_cadastro , data_recadastro ,  tipo, observacoes1, observacoes2, observacoes3 ]
                            await conn.query(sql,   (err, result )=>{
                                if(err){
                                    console.log(err)
                                    //reject(err);
                                }else{
                                    console.log(`produto cadastrado com sucesso `)
                                   // resolve(result);
                                }
                            })
    }

}
 