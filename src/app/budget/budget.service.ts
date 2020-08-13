import {Injectable} from "@angular/core";
import {BudgetNewComponent} from "./budget-new/budget-new.component";
import {BudgetEditComponent} from "./budget-edit/budget-edit.component";
import {BudgetNew} from "./budget-new/budget-new.model";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AppService} from "../app.service"
import {BudgetTableComponent}  from "./budget-table/budget-table.component"
import { ActivatedRoute, Router } from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class BudgetService{
    constructor(private appService: AppService, private router: Router, private spinner: NgxSpinnerService){}
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
    

    changeBudgetStatus(id: number, status: boolean, btc: BudgetTableComponent){
        var self =  this;
        setTimeout(()=> btc.spinner.show(), 10);
        this.appService.editBudgetStatus(id, status).subscribe(function(data){
            
            
        self.appService.budgets().subscribe(function(budgets){
            btc.buds = budgets;
            btc.buds.forEach(function(value){
               value['approved'] =  value['approved']['data'][0];
            });
            if(status){
                alert("Orçamento " + id + " Aprovado!");
            } else{
                alert("Orçamento " + id + " Rejeitado!");
            }
            btc.spinner.hide();
        });
            
            
            
            
        });
        
    }
    
    processBudget(bNew: BudgetNew[]){
        bNew.forEach(function(value){
            
            
        });
        
    }
    
}