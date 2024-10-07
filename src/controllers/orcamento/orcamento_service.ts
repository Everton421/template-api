import { Response, Request } from "express";
import { SelectOrcamento } from "./selectOrcamento";
import { UpdateOrcamento } from "./updataOrcamento";
import { CreateOrcamento } from "./createOrcamento";

export class Orcamento_service {

    async cadastra(request: Request, response: Response) {
        const select = new SelectOrcamento();
        const update = new UpdateOrcamento();
        const create = new CreateOrcamento();

        function dataHora ( data:any  ) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            const segundos = String(data.getSeconds()).padStart(2, '0');
            return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        }



        const dados_orcamentos = request.body;

        if (dados_orcamentos.length > 0) {
            // Usando Promise.all para aguardar todas as promessas
            const results = await Promise.all(dados_orcamentos.map(async (i:any) => {
                const aux: any = await select.validaOrcamento( i.codigo, i.vendedor );


                      if (aux.length > 0) {
                           const dataRecadastroSistema = dataHora(aux[0].DATA_RECAD);
                           console.log(`Orcamento ${i.codigo} encontrado, verificando atualizacao!`)

                          if(i.data_recadastro >  dataRecadastroSistema){
                            try{
                               await update.update(i, aux[0].CODIGO );
                                  console.log(`Orcamento ${i.codigo} atualizado com sucesso!`)
                                 return { codigo: aux[0].codigo, status: 'atualizado' };
                                }catch(e){ console.log("Erro ao atualizar orcamento ", i.codigo)} 
                            }else{
                                    console.log(`Orcamento  ${i.codigo} nao teve atualizacao`)
                            }
                          } else {
                            try{
                             const result = await create.create(i);
                              return { codigo: result  , status: 'inserido' };
                            }catch(e){ console.log(`Erro ao gravar o orcamento`)}
                            }
            }));

            // Responde após todos os orçamentos terem sido processados
            return response.status(200).json({ results });
        }else{
            return response.status(400).json({ msg: "Nenhum dado de orçamento fornecido." });

        }

    }
///////
////////////////////////////
///////

    async selecionaPorData(){
        
    }




}
