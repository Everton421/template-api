import express,{NextFunction, Request,Response} from 'express';
import "express-async-errors";
import cors from 'cors';
const https = require('https');
const fs = require('fs');

import { router } from './routes';


const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };


        const app = express();
        const httpsServer = https.createServer(credentials, app);

        app.use(express.json());    
        app.use(router)
        app.use(cors)
        app.use(
                (err:Error, req:Request, res:Response, next:NextFunction)=>{
                    if(err instanceof Error){
                        return res.status(400).json({
                            error: err.message,
                        })
                    }
                    res.status(500).json({
                        status:'error ',
                        messsage: 'internal server error.'
                    })
                })

    //app.listen(3000,()=>{ console.log('app rodando porta 3000')}
    const PORT = 3000; // Porta padrão para HTTPS
    httpsServer.listen(PORT, () => {
        console.log(`Servidor HTTPS rodando na porta ${PORT}`);
      });

