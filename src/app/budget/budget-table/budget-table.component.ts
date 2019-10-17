import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService, public route: ActivatedRoute) { }

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
    
    ngOnInit() {
        setTimeout(()=> this.spinner.show(), 10);
        var self = this;
        this.n = 1;
        
        if(this.route.queryParams['value']['clientId']){
            this.appService.postBudgetsClient({clientId: this.route.queryParams['value']['clientId']}).subscribe(function(budgets){
                self.buds = budgets;
                console.log(self.buds);
                
                self.spinner.hide();
            });    
        } else{
            this.appService.budgets().subscribe(function(budgets){
                self.buds = budgets;
                self.buds.forEach(function(data){
                   data['approved'] =  data['approved']['data'][0];
                });
                self.spinner.hide();
            }); 
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