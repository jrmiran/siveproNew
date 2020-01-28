export interface ServiceOrderExecution{
    so: number;
    employee: string;
    date: string;
    percentage: number;
    valueSo: number;
    valueExecution: number;
    empreita: number; //Valor pago ao funcionário
    stone: number;
    empreitaProduction: number; //Valor da produção na empreita
    function: string;
}