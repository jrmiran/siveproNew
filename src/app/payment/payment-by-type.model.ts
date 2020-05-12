import {Payment} from './payment.model';

export interface PaymentByType{
    type: string;
    payments: Payment[];
    totalValue: number;
}