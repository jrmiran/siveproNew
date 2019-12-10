import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {ParameterService} from '../../shared/parameter.service';

@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService, public route: ActivatedRoute, private parameterService: ParameterService) { }

    buds: Object[] = [];
    flag: boolean = true;
    n: number;
    budgetTest: Object[];
    self = this;
    
    openBudget(id: any){
        alert("Open Budget " + id);
    }
    
    searchBudgetIndex(id: any){
        this.buds.forEach(function(data){
            
        });
    }
    
    loadBudgets(){
        var self = this;
        setTimeout(()=> this.spinner.show(), 10);
        if(this.route.queryParams['value']['clientId']){
                this.appService.postBudgetsClient({clientId: this.route.queryParams['value']['clientId']}).subscribe(function(budgets){
                    self.buds = budgets;
                    self.buds.forEach(function(data){
                       data['approved'] =  data['approved']['data'][0];
                    });
                    self.spinner.hide();
                });  
            window.sessionStorage.setItem('budgetsTable', JSON.stringify(self.buds));
            } else{
                this.appService.budgets().subscribe(function(budgets){
                    self.buds = budgets;
                    self.buds.forEach(function(data){
                       data['approved'] =  data['approved']['data'][0];
                    });
                    self.spinner.hide();
                    console.log(JSON.stringify(self.buds));
                    window.sessionStorage.setItem('budgetsTable', JSON.stringify(self.buds));
                }); 
                
            }
    }
    
    ngOnInit() {
        
        var self = this;
        this.n = 1;

        if(window.sessionStorage.getItem('budgetsTable') == null || window.sessionStorage.getItem('budgetsTable') == ""){    
            self.loadBudgets();
        } else{
            self.buds = JSON.parse(window.sessionStorage.getItem('budgetsTable'))
        }
        
        interval(1000).pipe(
            map((x) => {
                console.log(this.n);
                this.n ++;
            })
        );
        console.log(this.n);
        
    }
}