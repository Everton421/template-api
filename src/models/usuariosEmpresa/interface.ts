export interface usuarioEmpresa {
    codigo:number,
    usuario:string,
    email:string,
    cnpj:string,
    senha:string,
    responsavel:string        
    }

export type newUserEmpresa = Omit<usuarioEmpresa , "codigo"> 
