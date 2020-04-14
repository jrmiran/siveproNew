export interface ExecutionServiceOrder{
    id: number;
    serviceOrderId: number;
    startDate: Date;
    endDate: Date;
    empreita: boolean;
    empreitaValue: number;
    stone: boolean;
    stoneValue: number;
    empreitaPaymentDate: Date;
    percentage: number;
    employeeId: number;
    executionValue: number;
}