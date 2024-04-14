import { conn, db_publico, db_estoque, db_vendas } from "../../database/databaseConfig";
import { Request, Response, response } from "express";

export class produto {


//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto

  async busca(conexao:any , req: Request, res: Response, dbestoque:any,dbpublico:any) {
    const parametro = req.params.produto;
    const sql: string = `
            SELECT DISTINCT p.codigo, p.grupo, p.descricao,p.num_fabricante,
            p.num_original, p.outro_cod sku, p.marca, p.ativo, p.tipo, 
            p.class_fiscal, p.origem, p.cst, p.observacoes1 ,p.observacoes2,
            p.observacoes3, ps.estoque, pp.preco
            FROM ${dbpublico}.cad_prod p
            JOIN ${dbestoque}.prod_setor ps ON p.codigo = ps.produto
            JOIN ${dbpublico}.prod_tabprecos pp ON p.codigo = pp.produto
            WHERE p.CODIGO like ?  OR p.DESCRICAO like ?
            limit 25
            `;
    const queryParam = `%${parametro}%`;
    return new Promise(async (resolve, reject) => {
      await conexao.query(sql, [queryParam, queryParam], (err: any, result: any) => {
        if (err) {
          //res.status(500).json({ error: 'Erro interno do servidor' });
          res.status(500).json(err)
        } else {
          resolve(result); //res.json(result)
        }
      })

    })
  }




//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo ou outro_cod do produto

  async buscaProduto(conexao:any, req:Request,res:Response, estoque:any, publico:any) {
       const codigo:any =  req.params.produto
    let auxProduto: any = [];
    let auxSetores: any = [];
    let auxTabelaDePreco:any=[];
    let auxUnidades:any=[];

    try {
      auxProduto = await this.prodQuery(conexao ,codigo,res, publico);
      auxSetores = await this.prodSetorQuery(conexao, codigo, estoque);
      auxTabelaDePreco = await this.tabelaPrecosQuery(conexao, codigo, publico);
      auxUnidades = await this.unidadesQuery(conexao, codigo, publico);
    } catch (err) {
      console.log(err);
    }

 let produto  = auxProduto[0];
 let setores = auxSetores[0];
let tabelaDePreco = auxTabelaDePreco[0];
let unidades = auxUnidades[0];

    const aux = {
      produto ,
      setores ,
      tabelaDePreco,
      unidades
    };
    return aux;
  }



  async prodSetorQuery(conexao:any ,codigo: number, estoque:any) {
    return new Promise(async (resolve, reject) => {
      const sql: string = `
        SELECT ps.setor codigoSetor  , s.nome nome_setor ,ps.produto, ps.estoque, ps.LOCAL1_PRODUTO local1,	ps.LOCAL2_PRODUTO local2,	ps.LOCAL3_PRODUTO local3,	ps.DATA_RECAD data_recad,	ps.LOCAL_PRODUTO local
         FROM ${estoque}.prod_setor ps
          JOIN ${estoque}.setores s
         on s.codigo = ps.setor
          WHERE produto = ${codigo}
      `;
      await conexao.query(sql, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  

  async prodQuery(conexao:any, codigo: number,res:Response,publico:any) {
    return new Promise(async (resolve, reject) => {
      let sql = `SELECT CODIGO codigo, GRUPO grupo, DESCRICAO descricao, NUM_FABRICANTE numfabricante, 
      NUM_ORIGINAL num_original,	OUTRO_COD outro_cod, 	 	MARCA marca, 	ATIVO ativo, 	TIPO tipo, CLASS_FISCAL class_fiscal,	ORIGEM origem,	CST cst, OBSERVACOES1 observacoes1,
      OBSERVACOES2 observacoes2 , OBSERVACOES3 observacoes3
      FROM ${publico}.cad_prod WHERE codigo = ${codigo}  `;
      
      await conexao.query(sql, (err:any, result:any) => {
        if (err) {
          //reject(err);
          res.status(500).json({ err: "erro ao atualizar" });
        } else {
          resolve(result);
        }
      });
    });
  }
   async tabelaPrecosQuery(conexao:any, codigo:number,publico:any){
      return new Promise( async (resolve, reject)=>{
          let sql = `
          
          SELECT 
          TABELA tabela, 	PRODUTO produto,	LBV lbv ,	PRECO preco,
           	PROMOCAO promocao	,VALID_PROM valid_prom,	PROMOCAO_NET promocao_net,	VALID_PROM_NET valid_prom_net ,
            	LBC	lbc, PROM_ESPECIAL prom_especial,	DATA_RECAD	data_recad , PROM_ESPECIAL_NET	prom_especial_net ,VALOR_FRETE valor_frete,
              INICIO_PROM inicio_prom

          
          from ${publico}.prod_tabprecos WHERE produto = ${codigo};`;
          await conexao.query(sql, (err:any,result:any)=>{
            if(err){
              reject(err);
            }else{
              resolve(result);
            }
          });
      });

   }

   async unidadesQuery(conexao: any, codigo: number, publico: any) {
    return new Promise(async (resolve, reject) => {
        let sql = `
            SELECT
            PRODUTO produto, ITEM item,  DESCRICAO descricao, SIGLA sigla, FRACIONAVEL fracionavel, FATOR_VAL fator_val, FATOR_QTDE fator_qtde, PADR_ENT padr_ent,
            PADR_SAI padr_sai, PADR_SEP padr_sep, UND_TRIB und_trib
            FROM ${publico}.unid_prod WHERE PRODUTO = ${codigo};`;

        await conexao.query(sql, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

  async buscaDoAcerto(conexao:any,req: Request, res: Response) {
    const parametro = req.params.produto;
    const sql: string = `
              SELECT p.codigo, p.descricao, ps.estoque, pp.preco
              FROM ${db_publico}.cad_prod p
              JOIN ${db_estoque}.prod_setor ps ON p.codigo = ps.produto
              JOIN ${db_publico}.prod_tabprecos pp ON p.codigo = pp.produto
              WHERE p.CODIGO = ?;
              `;
    const queryParam = `${parametro}`;
    return new Promise(async (resolve, reject) => {
      await conexao.query(sql, [queryParam], (err: any, result: any) => {
        if (err) {
          //res.status(500).json({ error: 'Erro interno do servidor' });
          res.status(500).json(err)
        } else {
          resolve(result); //res.json(result)
        }
      })
    })
  }

  async insereAcerto(req: Request, res: Response, json: any) {
    const { setor, codigo, estoque, novoSaldo } = json;

    async function queryProd() {
      let sql2 = `SELECT codigo from ${db_publico}.cad_prod where codigo=${codigo};`;
      return new Promise(async (resolve, reject) => {
        await conn.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    try {
      let result = await queryProd(); // Await the result of queryProd
      if (result && result.length > 0) { // Check if result is not empty
        const sql = `UPDATE ${db_estoque}.prod_setor 
                                     SET 
                                     setor = 1,
                                     estoque = ${novoSaldo}
                                     WHERE
                                     produto = ${codigo};`;

        await conn.query(sql, (err: any, result: any) => {
          if (err) {
            res.status(500).json({ err: "erro ao atualizar" });
          } else {
            res.status(200).json({ "ok": `produto ${codigo} atualizado` });
          }
        });
      } else {
        console.log("produto não cadastrado");
        res.status(400).json({ err: "produto não encontrado" });
      }
    } catch (error) {
      console.log("erro ao buscar produto:", error);
      res.status(500).json({ err: "erro ao buscar produto" });
    }
  }



  async buscaCompleta(conexao:any,req: Request, res: Response) {
    let sql = `select * from ${db_publico}.cad_prod;`;
    conexao.query(sql, (err:any, response:any) => {
      if (err) {
        throw err;
      } else {
        return res.json(response);
      }
    })
  }
  async buscaSetores(conexao:any ,estoque:any, req:Request ,res:Response) {

    return new Promise(async (resolve, reject) => {

      const sql = `
        SELECT CODIGO codigo, NOME nome 
        FROM ${estoque}.setores;
      `
      
      await conexao.query(sql, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }



}
/*
 
 
router.get('/produto/:produto', (req: Request, res: Response) => {
//  res.header('Access-Control-Allow-Origin', '*'); 
//  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//  res.header('Access-Control-Allow-Headers', 'Content-Type');

const parametro = req.params.produto;
    const sql = `
    SELECT p.codigo, p.descricao, ps.estoque, pp.preco
    FROM ${publico}.cad_prod p
    JOIN ${estoque}.prod_setor ps ON p.codigo = ps.produto
    JOIN ${publico}.prod_tabprecos pp ON p.codigo = pp.produto
    WHERE p.CODIGO LIKE ? OR p.descricao LIKE ?
    LIMIT 10
    `;
 
const queryParam = `%${parametro}%`;
con.query(sql, [queryParam, queryParam], (err: any, result: any) => {
  if (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
    return;
  }
//  console.log(result);
  res.json(result)
});
});
 
*/
