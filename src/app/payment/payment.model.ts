export interface Payment{
    type: string;
    date: string;
    bill: string;
    part: string;
    value: number;
    status: string;
    check: string;
    paymentForm: string;
    paymentType: string;
    note: string;
    budgetId: number;
}