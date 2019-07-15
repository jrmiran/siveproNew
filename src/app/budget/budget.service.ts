import {Injectable} from "@angular/core";
import {BudgetNewComponent} from "./budget-new/budget-new.component";
import {BudgetEditComponent} from "./budget-edit/budget-edit.component";
import {BudgetNew} from "./budget-new/budget-new.model";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class BudgetService{
    constructor(){}
    budgetNew: BudgetNew[]=[];
    
    addItemBudget(b: BudgetNew, budgetNewComponent: BudgetNewComponent){
        budgetNewComponent.addItemBudget(b);
        
    }
    
    addItemEditBudget(b: BudgetNew, budgetEditComponent: BudgetEditComponent){
        console.log("Está no budget Service");
        budgetEditComponent.addItemBudget(b);
        
    }
    
    nextLevelBudget(b: BudgetNewComponent, date: string, client: string, thirdParty: string, seller: string){
        //b.setDate(date);
        //b.setClient(client);
        //b.setThirdParty(thirdParty);
        //b.setSeller(seller);
    }
    
    
    processBudget(bNew: BudgetNew[]){
        bNew.forEach(function(value){
            
            
        });
        
    }
    
}