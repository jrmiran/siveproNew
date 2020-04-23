import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {ParameterService} from '../../shared/parameter.service';
import {FormControl, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService, public route: ActivatedRoute, private parameterService: ParameterService, private formBuilder: FormBuilder) { }

    buds: Object[] = [];
    filteredBuds: Object[] = [];
    flag: boolean = true;
    n: number;
    budgetTest: Object[];
    self = this;
    filterForm: FormGroup;
    
    
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
        this.filteredBuds = this.buds;
        this.filterForm.get('cbStatus')['controls'].forEach((data, index)=>{
            if(!data['value']){
                document.getElementById('cb' + index).click();
            }
        })
    }
    
    ngOnInit() {
        
        var self = this;
        this.n = 1;
        
        this.filterForm = this.formBuilder.group({
            cbStatus: this.formBuilder.array([new FormControl(true), new FormControl(true), new FormControl(true)])
        })
        
        this.filterForm.get('cbStatus').valueChanges.subscribe((v)=>{
            this.filteredBuds = [];
            if(v[0]){
                this.filteredBuds = this.buds.filter((data)=>{return data['status'] == "Aprovado"});
            }
            if(v[1]){
                this.filteredBuds = this.filteredBuds.concat(this.buds.filter((data)=>{return data['status'] == "Rejeitado"}));
            }
            if(v[2]){
                this.filteredBuds = this.filteredBuds.concat(this.buds.filter((data)=>{return data['status'] == "Em Análise"}));
            }
            //this.filteredBuds.sort((a,b) => a['budgetId'].localeCompare(b['budgetId']));
            this.filteredBuds.sort((a,b) => {
                return b['budgetId'] - a['budgetId'];
            });
        })
        
        if(window.sessionStorage.getItem('budgetsTable') == null || window.sessionStorage.getItem('budgetsTable') == ""){    
            self.loadBudgets();
        } else{
            self.buds = JSON.parse(window.sessionStorage.getItem('budgetsTable'));
            this.filteredBuds = this.buds;
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