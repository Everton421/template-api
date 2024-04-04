import { conn, db_estoque, db_publico } from "../../database/databaseConfig";

export class InsereProdutos {
    



    async  index( json:any, conexao:any, dbpublico:any , dbestoque:any, res:Response ) {
        if (!json.produto) {
            console.log('Produto não informado');
            return res.status(500).json({ error: "Produto não informado" });
        }
        
        const sku = json.produto.outro_cod;
     const aux: any = await this.validaSkuCadastrado(sku, conexao, dbpublico);
   
        
        if(aux.length > 0 ){
         // console.log("Produto já cadastrado com esse SKU");
            return res.status(500).json({ err: "Produto já cadastrado com esse SKU" });
        }

        const idProd: any = await this.insertProduto(json.produto, conexao, dbpublico);
           
           if(!idProd){
                console.log('erro ao cadastrar')
                return  res.status(500).json({err:"erro ao cadastrar produto"})
           
            }

            try {
                await this.insertTabelaDePrecos(json.tabelaDePreco, idProd, conexao, dbpublico);
                console.log("tabela ok produto:"+idProd)
            }catch(err)
            {
                return res.status(500).json({err:"erro ao cadastrar tabela de preços"})
            }
        
        
            try {
                await this.insertUnidade(json.unidades, idProd, conexao, dbpublico);
                console.log("unidades ok produto:"+idProd)
            }catch(err)
            {
                return res.status(500).json({err:"erro ao cadastrar unidade de medida"})
            }

            try {
                await this.insertProdutoSetor(json.setores, idProd, conexao, dbestoque);
                console.log("setor ok produto:"+idProd)

            }catch(err)
            {
                return res.status(500).json({err:"erro ao cadastrar setor"})
            }

         
        return res.status(200).json({"codigo": idProd});

    }         





   async insertProduto( produto:any, conexao:any, publico:any ){
       
        const {
            codigo, 
            grupo ,
            descricao, 
            numfabricante, 
            num_original ,
            outro_cod ,
            marca ,
            ativo ,
            tipo ,
            class_fiscal, 
            origem,
            cst,
            observacoes1,
            observacoes2,
            observacoes3
        } = produto;

        return new Promise( async (resolve, reject )=>{
            await conexao.query( ` INSERT INTO ${publico}.cad_prod 
                (GRUPO,DESCRICAO,NUM_FABRICANTE,NUM_ORIGINAL,OUTRO_COD,APLICACAO,MARCA,ATIVO,TIPO,CLASS_FISCAL
                    ,ORIGEM,CST,OBSERVACOES1,OBSERVACOES2,OBSERVACOES3)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,[  grupo ,descricao, numfabricante, num_original ,outro_cod, descricao, marca ,ativo ,tipo ,class_fiscal, origem,cst,observacoes1,observacoes2,observacoes3 ]     
            , (err:any, result:any)=>{
                    if(err){
                        reject(err.sqlMessage);
                    }else{
                        resolve(result.insertId);
                    }
            })

        })
    }

    async insertTabelaDePrecos(json: any, codigo: number, conexao: any, publico: any) {
        const {
            tabela,
            produto,
            lbv,
            preco,
            promocao,
            valid_prom,
            promocao_net,
            valid_prom_net,
            lbc,
            prom_especial,
            data_recad,
            prom_especial_net,
            valor_frete,
            inicio_prom
        } = json;
    
        return new Promise((resolve, reject) => {
            conexao.query(
                `INSERT INTO ${publico}.prod_tabprecos (TABELA, PRODUTO)
                VALUES (?, ?)`,
                [tabela, codigo],
                (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    async validaTabelaDePreco(  codigo: number, conexao: any, publico: any){
        return new Promise( async (reject , resolve )=>{
            await conexao.query(
                ` SELECT produto FROM ${publico}.prod_tabpreco WHERE produto =${codigo};`
             ,(err:any, result:any )=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }

             })

        })

    } 

    async insertUnidade( json: any, codigo: number, conexao: any, publico: any ){

        const {

            descricao,
            sigla,
            fracionavel,
            fator_val,
            fator_qtde,
            padr_ent,
            padr_sai,
            padr_sep,
            und_trib
        } = json


        return new Promise(  (resolve, reject)=>{
             conexao.query( 
                ` INSERT INTO ${publico}.unid_prod 
                    (PRODUTO, DESCRICAO, SIGLA)
                    VALUES( ?,?,?)
                `,[codigo, descricao, sigla ], (err:any, result:any)=>{
                        if(err){
                            reject(err.sqlMessage);
                        }else{
                            resolve(result);
                        }

                }
            )
        })
    }

async insertProdutoSetor( json: any, codigo: number, conexao: any, dbestoque: any){
    const {
        codigoSetor,
        nome_setor,
        produto,
        estoque,
        local1,
        local2,
        local3,
        data_recad,
        local,
        
    } = json;


    return new Promise( async ( resolve, reject )=>{

        await conexao.query(
            ` INSERT INTO ${dbestoque}.prod_setor 
            ( SETOR, PRODUTO, ESTOQUE, LOCAL1_PRODUTO, LOCAL2_PRODUTO, LOCAL3_PRODUTO, LOCAL_PRODUTO)
            VALUES( ?,?,?,?,?,?,?)
            `,[1, codigo, 0, local1, local2, local3, local ], (err:any, result:any)=>{

                if(err){
                    reject(err);
                }else{
                    resolve(result)
                }
            }
        )
    })
}
async buscaProdutoCadastrado( codigo:any, conexao:any, dbestoque:any, dbpublico:any){
    return new Promise( (reject, resolve)=>{
        conexao.query(
            `
            SELECT p.codigo, p.descricao, ps.estoque, pp.preco
            FROM ${dbpublico}.cad_prod p
            JOIN ${dbestoque}.prod_setor ps ON p.codigo = ps.produto
            JOIN ${dbpublico}.prod_tabprecos pp ON p.codigo = pp.produto
            WHERE p.CODIGO = ${codigo};
                `, ( err:any, result:any )=>{
                    if(err){
                            reject(err);
                    }else{
                        resolve(result);
                    }
                }
            
            )
    })
}

async validaSkuCadastrado(codigo: any, conexao: any, dbpublico: any) {
    return new Promise((resolve, reject) => {
        conexao.query(
            `SELECT * FROM ${dbpublico}.cad_prod WHERE OUTRO_COD = ?`,
            [`${codigo}`],
            (err: any, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}






}