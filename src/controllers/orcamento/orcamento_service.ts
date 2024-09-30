import { Response, Request } from "express";
import { SelectOrcamento } from "./selectOrcamento";
import { UpdateOrcamento } from "./updataOrcamento";
import { CreateOrcamento } from "./createOrcamento";

export class Orcamento_service {

    async cadastra(request: Request, response: Response) {
        const select = new SelectOrcamento();
        const update = new UpdateOrcamento();
        const create = new CreateOrcamento();
        const dados_orcamentos = request.body;

        if (dados_orcamentos.length > 0) {
            // Usando Promise.all para aguardar todas as promessas
            const results = await Promise.all(dados_orcamentos.map(async (i:any) => {
                const aux: any = await select.validaOrcamento( i.codigo, i.vendedor );
                if (aux.length > 0) {
                    console.log('Já existe um orçamento registrado com o código', i.codigo);
                    await update.update(i);
                    return { codigo: i.codigo, status: 'atualizado' };
                } else {
                    const result = await create.create(i);
                    return { codigo: result  , status: 'inserido' };
                }
            }));

            // Responde após todos os orçamentos terem sido processados
            return response.status(200).json({ results });
        }

        return response.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });
    }
///////
////////////////////////////
///////

    async selecionaPorData(){
        
    }




}
