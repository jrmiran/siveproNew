import {Injectable} from "@angular/core";
import { Http } from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetNew } from '../budget/budget-new/budget-new.model'

@Injectable()
export class ParameterService{
    constructor(){}
    
    budgets: BudgetNew[];
    
    setBudgets(budgets: BudgetNew[]){
        this.budgets = budgets;
    }
    
    getBudgets(){
        return this.budgets;
    }
}