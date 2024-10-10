import { Router,Request,Response, NextFunction } from "express";
import { controllerProduto } from "./controllers/produtos/produtos";
import { CreateOrcamento } from "./controllers/orcamento/createOrcamento";  
import { Cliente    } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";
import { conn,conn2,db_estoque, db_estoque2, db_publico, db_publico2 } from "./database/databaseConfig";
import { InsereProdutos } from "./controllers/produtos/insereProdutos";
import { Usuario } from "./controllers/usuario/usuario";
import 'dotenv/config';
import { Marcas } from "./controllers/produtos/marcas";
import { Grupo } from "./controllers/produtos/grupo";
import { Tipo_de_os } from "./controllers/tipo_de_os/tipo_de_os";
import { Servicos } from "./controllers/serviços/servicos";
import { Veiculo } from "./controllers/veiculo/veiculo";
import { Orcamento_service } from "./controllers/orcamento/orcamento_service";
import { SelectOrcamento } from "./controllers/orcamento/selectOrcamento";

  const crypt = require('crypt');
  const router = Router();
  export const versao = '/v1'

    router.get(`${versao}/`, async (req:Request, res:Response)=>{
      await conn.getConnection(
        async (err:Error)=>{
          if(err){
              return res.status(500).json({"erro": "falha ao se conectar ao banco de dados1 "})
          }else{
          //  res.header("Access-Control-Allow-Origin", "*");
          //  res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
            return  res.json({"ok":true});
          }
        }
      )
    })

 
    router.post(`${versao}/teste`, ( req, res )=>{
      console.log(req.body)
    })

/*------------------------ rota de login -------------------*/
function checkToken(req:Request, res:Response, next:NextFunction){
  const header = req.headers['authorization']
  const token =  header && header.split(" ")[1]

  if(!token){
    return res.status(401).json({msg: "Acesso negado, token não informado! "})
  }

  const secret = process.env.SECRET;

  if(token === secret){
    next();
  }else{
  res.status(400).json({msg:"token invalido"})
  }

}

router.post(`${versao}/auth`, async (req:Request, res:Response)=>{

  const { nome, senha } = req.body;
  
  if(!nome){
    res.status(500).json({"error": "usuario não informado"})
  }
  if(!senha){
    res.status(500).json({"error": "senha não informada"})
    }
    const obj = new Usuario();
    const aux:any = await obj.usuarioSistema(conn, db_publico, nome, senha ); 
    console.log(aux)
    if(!aux){
      res.status(500).json({"error": "usuario invalido"})
    }
    if(aux){
      res.status(200).json({"codigo": aux.codigo, "nome":aux.nome })
    }

  });

  router.get( `${versao}/produtos/:produto`,checkToken, async (req: Request, res: Response) => {
    const a = new controllerProduto();
    const aux = await a.busca(conn,req,res, db_estoque,db_publico);
    res.json(aux)
  });


/* ------------------ rotas acerto -------------------------- */
//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo 
router.get(`${versao}/acerto/produto/:produto`,checkToken,async(req:Request, res:Response)=>{
  const obj = new controllerProduto();
const aux:any = await obj.buscaDoAcerto( conn ,req,res , db_estoque, db_publico);
 res.json(aux[0])
})


//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto
router.get(`${versao}/acerto/produtos/:produto` ,checkToken, async (req: Request, res: Response) => {
  const a = new controllerProduto();
  const aux = await a.busca(conn,req,res, db_estoque,db_publico);
  res.json(aux)
});


//  busca setores do sistema 
router.get(`${versao}/acerto/setores/`, checkToken,async (req: Request, res: Response) => {
  const a = new controllerProduto();
  const aux = await a.buscaSetores(conn,db_estoque, req,res);
  res.json(aux)
});
//busca produto no setor
router.get(`${versao}/acerto/produtoSetor/:produto`, checkToken,async (req: Request, res: Response) => {
  const codigo:any  = req.params.produto;
console.log(codigo)
  const a = new controllerProduto();
  const aux = await a.prodSetorQuery(conn,codigo,db_estoque,);
  res.json(aux)
});
//busca preco do produto
router.get(`${versao}/acerto/produtoPreco/:produto`, checkToken,async (req: Request, res: Response) => {
  const codigo:any  = req.params.produto;
console.log(codigo)
  const a = new controllerProduto();
  const aux = await a.tabelaPrecosQuery(conn,codigo,db_publico,);
  res.json(aux)
});


//            recebe acerto de estoque
router.post(`${versao}/acerto`, checkToken,async (req:Request, res:Response)=>{
  const json = req.body
  const obj = new Acerto();
  try{
    await obj.insereAcerto(req, res, json ,db_estoque);
  }catch(err){console.log(err)}
})
/* ------------------------------------------------------------ */ 

/* clientes */ 

//router.get('/clientes/:cliente', async ()=> await new Cliente().busca);
     
const cliente = new Cliente();
const fpgt = new formaDePagamamento();
const tipo_os = new Tipo_de_os();

router.get(`${versao}/clientes`, cliente.buscaCompleta  );


router.get(`${versao}/offline/clientes`,   cliente.buscaCompleta  );

router.get(`${versao}/offline/formas_Pagamento/`, checkToken ,async  (req,res)=>{
  await fpgt.busca(req,res);
});

router.get( `${versao}/offline/produtos` ,checkToken, async ( req:Request, res:Response ) =>{
  let obj = new controllerProduto();
  let aux =  await obj.buscaCompleta()
  res .json (aux);
});
router.get(`${versao}/offline/veiculos`, checkToken , new Veiculo().buscaTodos)
router.get(`${versao}/offline/tipos_os`, checkToken , new Tipo_de_os().busca)
router.get(`${versao}/offline/servicos`, checkToken, new Servicos().busca)



router.get(`${versao}/tipos_os`, checkToken , new Tipo_de_os().busca)

router.get(`${versao}/servicos/:servico`, checkToken, new Servicos().buscaPorAplicacao)


router.get(`${versao}/usuarios`, checkToken, new Usuario().busca);

router.get(`${versao}/veiculos/:veiculo`, checkToken, new Veiculo().busca);


/**___________ */


router.post(`${versao}/pedidos`, checkToken , new Orcamento_service().cadastra)

router.get(`${versao}/pedidos`, checkToken , new Orcamento_service().selecionaPorData)
router.get(`${versao}/pedidos/todos`, checkToken , new Orcamento_service().selecionaTodos)

 

/**___________ */

    export {router} 