import {ExecutionServiceOrder} from './execution-service-order.model';
export interface EmployeeAward{
    employeeId: number;
    employeeName: string;
    personalPercentage: number;
    productionPercentage: number;
    normalProduction: number;
    empreitaProduction: number;
    payedEmpreita: number;
    employeeFunction: string;
    awardValue: number;
    executions: ExecutionServiceOrder[];
}