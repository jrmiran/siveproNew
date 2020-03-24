import {ItemBudgetV2} from './item-budget.model';

export interface ItemByAmbient{
    ambient: string;
    ambientValue: number;
    items: ItemBudgetV2[];
}