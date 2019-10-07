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
    idOs: number;
    privilege: boolean = false;
    administrator: boolean = false;
    
    getPrivilege(){
        return this.privilege;
    }
    
    setPrivilege(data: boolean){
        this.privilege = data;
    }
    
    getAdministrator(){
        return this.administrator;
    }
    
    setAdministrator(data: boolean){
        this.administrator = data;
    }
    
    getIdOs(){
        return this.idOs;
    }
    
    setIdOs(id: number){
        this.idOs = id;    
    }
    
    setBudgets(budgets: BudgetNew[]){
        this.budgets = budgets;
    }
    
    getBudgets(){
        return this.budgets;
    }
}