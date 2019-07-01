import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService ) { }

    buds: Object[];
    flag: boolean = true;
    n: number;
    budgetTest: Object[];
    
    ngOnInit() {
        var self = this;
        console.log(this.appService.converteMoedaFloat("R$ 150.000,94"))
        this.n = 1; 
        this.appService.budgets().subscribe(budgets => this.buds = budgets);
        
        interval(1000).pipe(
            map((x) => {
                console.log(this.n);
                this.n ++;
            })
        );
        console.log(this.n);
        
       /* while(this.flag){
            if (this.buds != null) {
                console.log("TEM ALGO");
                this.flag = false;
            } else{
                console.log("NADA");
            }
        }*/
        
        
    }
    
    
}