import { Router,Request,Response, NextFunction } from "express";
import { controllerProduto } from "./controllers/produtos/produtos";
import { controlerOrcamento } from "./controllers/orcamento/orcamento";
import { Cliente    } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";
import { conn,conn2,db_estoque, db_estoque2, db_publico, db_publico2 } from "./database/databaseConfig";
import { InsereProdutos } from "./controllers/produtos/insereProdutos";
import { Usuario } from "./controllers/usuario/usuario";
import 'dotenv/config';
import { Marcas } from "./controllers/produtos/marcas";
import { Grupo } from "./controllers/produtos/grupo";

const router = Router();

    router.get('/', async (req:Request, res:Response)=>{
      await conn.getConnection(
        async (err:Error)=>{
          if(err){
              return res.status(500).json({"erro": "falha ao se conectar ao banco de dados1 "})
          }else{
            return  res.json({"ok":true});
          }
        }
      )
    })

     router.post('/teste',(req,res) =>{
      //return res.json(req.headers)
      console.log(req.body);
      if(req.body){
        return res.status(200)
      }
//      console.log(req.headers);

     }) 


/*------------------------ rota de login -------------------*/
function checkToken(req:Request, res:Response, next:NextFunction){
  const header = req.headers['authorization']
  const token =  header && header.split(" ")[1]

  if(!token){
    return res.status(401).json({msg: "acesso negado"})
  }

  const secret = process.env.SECRET;

  if(token === secret){
    next();
  }else{
  res.status(400).json({msg:"token invalido"})
  }

}

router.post('/auth', async (req:Request, res:Response)=>{

  const { nome, senha } = req.body;
console.log(req.body)
  
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
      res.status(200).json({"usuario": aux.nome})
    }

  });

  router.get('/produtos/:produto',checkToken, async (req: Request, res: Response) => {
    const a = new controllerProduto();
    const aux = await a.busca(conn,req,res, db_estoque,db_publico);
    res.json(aux)
  });


/* ------------------ rotas acerto -------------------------- */
//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo 
router.get('/acerto/produto/:produto',checkToken,async(req:Request, res:Response)=>{
  const obj = new controllerProduto();
const aux:any = await obj.buscaDoAcerto( conn ,req,res , db_estoque, db_publico);
 res.json(aux[0])
})


//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto
router.get('/acerto/produtos/:produto',checkToken, async (req: Request, res: Response) => {
  const a = new controllerProduto();
  const aux = await a.busca(conn,req,res, db_estoque,db_publico);
  res.json(aux)
});


//  busca setores do sistema 
router.get('/acerto/setores/', checkToken,async (req: Request, res: Response) => {
  const a = new controllerProduto();
  const aux = await a.buscaSetores(conn,db_estoque, req,res);
  res.json(aux)
});
//busca produto no setor
router.get('/acerto/produtoSetor/:produto', checkToken,async (req: Request, res: Response) => {
  const codigo:any  = req.params.produto;
console.log(codigo)
  const a = new controllerProduto();
  const aux = await a.prodSetorQuery(conn,codigo,db_estoque,);
  res.json(aux)
});
//busca preco do produto
router.get('/acerto/produtoPreco/:produto', checkToken,async (req: Request, res: Response) => {
  const codigo:any  = req.params.produto;
console.log(codigo)
  const a = new controllerProduto();
  const aux = await a.tabelaPrecosQuery(conn,codigo,db_publico,);
  res.json(aux)
});


//            recebe acerto de estoque
router.post('/acerto', checkToken,async (req:Request, res:Response)=>{
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

router.get('/clientes/:cliente',   cliente.busca  );
router.get('/offline/clientes',   cliente.buscaCompleta  );

router.get('/formas_Pagamento/', checkToken ,async  (req,res)=>{
  await fpgt.busca(req,res);
});

router.post('/orcamentos',checkToken,  new controlerOrcamento().cadastra);
router.put('/orcamentos',checkToken,  new controlerOrcamento().atualizaOrcamento);
router.get('/orcamentos/diario/:filtro',checkToken,  new controlerOrcamento().buscaOrcamentosDoDia);
router.get('/orcamentos/:codigo',checkToken,  new controlerOrcamento().buscaPorCodigo);

/**___________ */

router.get('/offline/produtos',checkToken, async ( req:Request, res:Response ) =>{
  let obj = new controllerProduto();
  let aux =  await obj.buscaCompleta()
  res .json (aux);
});
/**___________ */

    export {router} 