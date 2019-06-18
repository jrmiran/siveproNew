import {Client}  from '../clients/client.model';
import {Terceiro}  from '../clients/terceiro.model';

export interface BudgetModel{
    client: Client;
    date: string;
    terceiro: Terceiro;
    vendor: string;
    valorTotal: number;
    discount: number;
    valorComDesconto: number;
}