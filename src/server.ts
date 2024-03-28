import express,{NextFunction, Request,Response} from 'express';
import "express-async-errors";
import cors from 'cors';
const https = require('https');
const fs = require('fs');

import { router } from './routes';

const keyPem = 
`
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
a5uFVc+IYX55o+UYFbInkA==
`

const certPem = 
`
MIIFUTCCAzmgAwIBAgIUQ0Xf1gkzpLRBhar0Hp40fhkKbaIwDQYJKoZIhvcNAQEL
BQAwODETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lk
Z2l0cyBQdHkgTHRkMB4XDTI0MDMyODEzMjEyOFoXDTI1MDMyODEzMjEyOFowODET
MBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQ
dHkgTHRkMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAjy2ZPc2VyQie
5kZr5U3Ctc/B8zKqIBpv2TZ4aBayQqLkMZnVrsFOds/VglXcOBecaK9/p1jILkYW
teGMW+QCDpa3ZtAZnv+RQ2flYprw3mlrEGGTD9bgOlBtaFCmGOcEupoy2cH8BE7x
83EvpWBnRX4GBF/lFwdGyPVra7jQKef7aF1f/ML9rFrj7I4YJeGeJyy3sXpRhFTh
OPKZ4gm+f8hNSmLeyTrX90LpTEZ3fAFLYAQNmvE/LjQpwPXqIjbmYJEa4CtlE9ex
Cgo9+3G0je/eCHJGAs3la04eJl0+fMHVIB+n0JbGQU89o8F10QZn65a3iYB/tBrm
/e0nSmwzFQVij0kCNW06Woo1B7qGaaJAlPNgi3Zv5B3Fz9gt6aoWlH5cZ9RemXwE
TfSX6+JRKK2R79bSHovTLpCP1EiL07lqOtmudcw5ikSmTxxGd0d3H7zikLHa61eI
XdF41+1lgWfCA+8qk9BY66hnAIcK9ycDtgO3De8w4tT5gBXykxgBrHbSlBeLcdFj
H3p1TJHdo86fMXg/V7STMMC1Rj5CE3R2nlMmfeRjOI7UFG/+7fECgz4Dz/Mc7ME1
niC0dWBzwu3jGw6gqoj699OcaPYRaH8C9kZ8IG6VWH/fsY6CbADHQs9nz7DVYPeo
s8yzhOSQwNjenw9GouDCUt3sVx/HJkkCAwEAAaNTMFEwHQYDVR0OBBYEFP1KSXIl
iI6vWGO2Zjup9Ose389YMB8GA1UdIwQYMBaAFP1KSXIliI6vWGO2Zjup9Ose389Y
MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggIBAGQ0bHTfKC7dPOrk
Vj+5pCX0muWAS4zhDM15gwLrlkuEp9FsBUuU98S2Y6dcAbF8Ls0xO6WgsV40UqU8
+05fKFuRdaTrTcNTRV9bW/nUopBOHh+KMLLZV5vNaLkNE26JGRB3WpKTjFY/8sIW
Y5H+GJToBgDihqKPLRU5+Eq4aRPxGgKn5Pws33ePO2zM3lgWCEXpgZAVccr6/r5R
3/yP3nWtDjjpcrMdROr8OlV5sGuVnnP5W/5Lll8x6jCONd1zGx9cVnAw4+qJhTbO
Ys06iHI7p4X7C57wiZnVzQWkUx+pQYBPnib2JYJEtrmsSR6aHnVKXEAUAvZFjihk
tPdT3i7MEx+Shqvq8nespNzK7r8kTUvEYupFVfwDFnZjC8+DHs/4ZvljCXjPf2on
GUCgMthEN4yPhVSIaysnW3d2wX9GDGVkifxsWX7EmJYZZdQYnXHeKvIkKaNs6BcT
tSIL5FBL8DHjK4DruKqxt/JkVAzfd5fCwP6/jH319IcotsVcbvu8Ydy3NJZmnZ9+
Ypxt8SVf0UMiXunslAqWePDuOqCcgNuirOotto/icu7uIyBIOgy3CYybCh2qTlzg
a4XqgKoQqeScpK5iypxG11Eriexml6+NgaYGpV1C/wzW6XFi5LAieGVQIPSoV4wr
oTob7s4j7n/ej06YQnHUip5FxkrY
`

const privateKey = fs.readFileSync(keyPem, 'utf8');
const certificate = fs.readFileSync(certPem, 'utf8');
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

