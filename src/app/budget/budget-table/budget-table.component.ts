import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService) { }

    buds: Object[];
    flag: boolean = true;
    n: number;
    budgetTest: Object[];
    self = this;
    
    openBudget(id: any){
        alert("Open Budget " + id);
    }
    ngOnInit() {
        setTimeout(()=> this.spinner.show(), 10);
        var self = this;
        console.log(this.appService.converteMoedaFloat("R$ 150.000,94"))
        this.n = 1; 
        this.appService.budgets().subscribe(function(budgets){
            self.buds = budgets;
            self.spinner.hide();
        });
        
        interval(1000).pipe(
            map((x) => {
                console.log(this.n);
                this.n ++;
            })
        );
        console.log(this.n);
    }
    
    
}