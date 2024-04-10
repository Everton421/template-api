import { Router,Request,Response, NextFunction } from "express";
import { produto } from "./controllers/produtos/produtos";
import { controlerOrcamento } from "./controllers/orcamento/orcamento";
import { Cliente } from "./controllers/cliente/cliente";
import { formaDePagamamento } from "./controllers/formaDePagamamento/formaDePagamamento";
import { Acerto } from "./controllers/acerto/acerto";
import { conn,conn2,db_estoque, db_estoque2, db_publico, db_publico2 } from "./database/databaseConfig";
import { InsereProdutos } from "./controllers/produtos/insereProdutos";
import { Usuario } from "./controllers/usuario/usuario";
import 'dotenv/config';

const router = Router();

    router.get('/', async (req:Request, res:Response)=>{
      await conn.getConnection(
        (err:Error)=>{
          if(err){
              return res.status(500).json({"erro": "falha ao se conectar ao banco de dados "})
          }else{
            return  res.json({"ok":true});
          }
        }
      )
    })
     router.post('/teste',(req,res) =>{
        return res.json(req.headers)
     })

 //   router.post('/teste', async (req:Request, res:Response)=>{
 //     console.log(req.body);
 //     const obj = new InsereProdutos();
 //     const response = await obj.validaSkuCadastrado('wwww', conn, db_publico)
 //   
 //   })
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

  
  if(!nome){
    res.status(500).json({"error": "usuario não informado"})
  }
  if(!senha){
    res.status(500).json({"error": "senha não informada"})
    }

    const obj = new Usuario();
    const aux = await obj.usuarioSistema(conn, db_publico, nome, senha ); 
    console.log(aux)
    if(!aux){
      res.status(500).json({"error": "usuario invalido"})
    }
    if(aux){
      res.status(200).json({"ok": aux})
    }

  });




/* ------------------ rotas acerto -------------------------- */
//            busca 1 produto com suas configurações
//            consulta sql feita pelo codigo ou outro_cod do produto
router.get('/acerto/produto/:produto',checkToken,async(req:Request, res:Response)=>{
  const obj = new produto();
const aux = await obj.buscaProduto( conn2 ,req,res , db_estoque, db_publico);
 res.json(aux)
})


//busca varios produtos
// consulta sql  feita por codigo ou descricao do produto
router.get('/acerto/produtos/:produto', async (req: Request, res: Response) => {
  const a = new produto();
  const aux = await a.busca(conn,req,res );
  res.json(aux)
});


//  busca setores do sistema 
router.get('/acerto/setores/', async (req: Request, res: Response) => {
  const a = new produto();
  const aux = await a.buscaSetores(conn,db_estoque, req,res);
  res.json(aux)
});


//            recebe acerto de estoque
router.post('/acerto', async (req:Request, res:Response)=>{
  const json = req.body
  const obj = new Acerto();
  try{
    await obj.insereAcerto(req, res, json ,db_estoque);
  }catch(err){console.log(err)}
})
/* ------------------------------------------------------------ */ 

     

/* --------------------- cadastra produto --------------------------------------- */ 
      router.post('/produto/cadastrar', async (req: Request, res: Response) => {
        const json = req.body;
        //console.log(json)
         const a = new InsereProdutos();
         try{
        const response = await a.index(json, conn ,db_publico, db_estoque, res);
          //return response;
        }
        catch(err){
          res.json(err);
        }
      });
/* ------------------------------------------------------------ */ 

     

    export {router} 