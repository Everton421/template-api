
export interface UsuarioApi
{
codigo:number,
usuario:string,
email:string,
cnpj:string,
senha:string, 
responsavel:string       
}


export type newUser = Omit<UsuarioApi , "codigo"> 
