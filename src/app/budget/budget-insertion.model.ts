export interface BudgetInsertion{
    aprovado: boolean;              //false
    caminho: string;                //""
    data: string;                   //parâmetro
    desconto: number;               //obtem no budget-new.component
    observacao: string;             //"" (futuramente obtem no budget-new.component)
    retificado: number;             //1
    tipoCliente: string;            // parâmetro
    valorTotal: number;             //obtem no budget-new.component
    arquiteto_id: number;           //faz query
    clienteEmpresa_id: number;      //faz query
    clienteEmpresaa_id: number;     //faz query
    clienteJuridico_id: number;     //faz query
    pessoa_id: number;              //faz query
    vendedor_id: number;            //faz query
    poload: boolean;
}