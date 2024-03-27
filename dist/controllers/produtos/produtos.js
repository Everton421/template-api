"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produto = void 0;
const databaseConfig_1 = require("../../database/databaseConfig");
class produto {
    async busca(req, res) {
        const parametro = req.params.produto;
        const sql = `
            SELECT p.codigo, p.descricao, ps.estoque, pp.preco
            FROM ${databaseConfig_1.db_publico}.cad_prod p
            JOIN ${databaseConfig_1.db_estoque}.prod_setor ps ON p.codigo = ps.produto
            JOIN ${databaseConfig_1.db_publico}.prod_tabprecos pp ON p.codigo = pp.produto
            WHERE p.CODIGO like ?  OR p.DESCRICAO like ?
            LIMIT 10
            `;
        const queryParam = `%${parametro}%`;
        return new Promise(async (resolve, reject) => {
            await databaseConfig_1.conn.query(sql, [queryParam, queryParam], (err, result) => {
                if (err) {
                    //res.status(500).json({ error: 'Erro interno do servidor' });
                    res.status(500).json(err);
                }
                else {
                    resolve(result); //res.json(result)
                }
            });
        });
    }
    async acerto(req, res, json) {
        const { setor, produto, estoque, apelido, acao, historico, computador, data, hora, } = json;
        /*       const sql =
                `
                UPDATE ${db_estoque}.prod_setor
                set
                setor = ${setor},
                estoque = ${estoque}
                WHERE
                produto = ${produto}
                ;
                `;
              conn.query(sql, (err:any, result:any) =>{
                   if(err){
                     res.status(500).json({err:"erro ao atualizar"});
                   } else{
                     //res.status(200).json({"ok":"produto atualizado"})
                     res.status(200).json({"ok":"produto atualizado"});
                   }
                 });
 */
        const log = ` INSERT INTO ${databaseConfig_1.db_vendas}.log (APELIDO, COMPUTADOR, DATA, HORA, ACAO, HISTORICO) 
                              VALUES ( ${apelido},${computador},${data},${hora},${acao},${historico});`;
        const log2 = ` INSERT INTO ${databaseConfig_1.db_vendas}.log (APELIDO, COMPUTADOR,  ACAO, HISTORICO) 
                              VALUES ( 'teste','teste',2,'teste');`;
        databaseConfig_1.conn.query(log, (err, result) => {
            if (err) {
                res.status(500).json({ err: err });
                console.log(err);
            }
            else {
                console.log(result);
            }
        });
    }
    async buscaCompleta(req, res) {
        let sql = `select * from ${databaseConfig_1.db_publico}.cad_prod;`;
        databaseConfig_1.conn.query(sql, (err, response) => {
            if (err) {
                throw err;
            }
            else {
                return res.json(response);
            }
        });
    }
}
exports.produto = produto;
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
