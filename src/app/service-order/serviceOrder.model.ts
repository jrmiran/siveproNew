export interface ServiceOrderModel{
    id: number;
    budgetId: number;
    clientName: string;
    startDate: string;
    endDate: string;
    predictionDeliveryDate: string;
    detail: string;
    ambient: string;
    empreita: boolean;
    executing: boolean;
    employee: string;
    item: string;
    store: string;
    measure: string;
    note: string;
    product: string;
    size: string;
    ended: boolean;
    typeClient: string;
    value: string;
    seller: string;
    empreitaValue: string;
    stone: boolean;
}