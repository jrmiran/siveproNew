export interface PayrollPayment{
    bill: string;
    date: string;
    in: number;
    checkNumber:  number;
    status: string;
    value: number;
    paymentWay: string;
    note: string;
    employeeId: number;
    paymentType: string;
    budgetId: number;
}