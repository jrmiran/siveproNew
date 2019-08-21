import { Component, OnInit } from '@angular/core';
import { BudgetEditComponent } from '../budget/budget-edit/budget-edit.component'
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import { BudgetModel } from '../budget/budget.model';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import { ServiceOrderModel } from './serviceOrder.model';
import { BudgetNew } from '../budget/budget-new/budget-new.model';
import { formin } from './forminSO';
import { ParameterService } from '../shared/parameter.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-service-order',
  templateUrl: './service-order.component.html',
  styleUrls: ['./service-order.component.css']
})
export class ServiceOrderComponent implements OnInit {

    constructor(private router: ActivatedRoute, private appService: AppService, private formBuilder: FormBuilder, private parameterService: ParameterService, private spinner: NgxSpinnerService) { }
    
    mainBudget:  BudgetModel;
    serviceOrders: Object[];
    soForm: FormGroup;
    budgetId: number;
    storeName: string;
    thirdyName: string;
    seller: string;
    date: string;
    formin: formin;
    budgets: BudgetNew[] = [];
    currentItems: number[] = [];
    self: any;
    
    clickRow(ids: number[]){
        this.currentItems = ids;
        console.log(this.currentItems);
    }
    
    generateServiceOrder(){
        
        var self = this;
        var count = 0;
        var size = this.currentItems.length;
        this.spinner.show();
        self.currentItems.forEach(function(currentItem){
            self.appService.serviceOrderInsertion(self.formin.thirdy.replace(/[\/]/g,'%2F'),
                                                    self.budgets[currentItem].detalhe.replace(/[\/]/g,'%2F'),
                                                    self.budgets[currentItem].comodo.replace(/[\/]/g,'%2F'),
                                                    self.budgets[currentItem].item.replace(/[\/]/g,'%2F'),
                                                    self.formin.store.replace(/[\/]/g,'%2F'),
                                                    self.budgets[currentItem].medida.replace(/[\/]/g,'%2F'),
                                                    "",
                                                    self.budgets[currentItem].valorComDesconto,
                                                    self.formin.seller.replace(/[\/]/g,'%2F'),
                                                    self.formin.budgetId,
                                                    false).subscribe(function(data){
                count = count + 1;
                if(count == size){
                    alert("Ordens de serviço criadas");
                    self.appService.serviceOrder(self.formin['budgetId']).subscribe(function(data){
                        self.serviceOrders = data;
                        self.serviceOrders.forEach(function(value){
                            value['empreita'] =  value['empreita']['data'][0];
                            value['pedra'] =  value['pedra']['data'][0];
                        });
                    });
                    self.spinner.hide();
                }
                    console.log(currentItem);
            });    
        });
    }
    
    ngOnInit() {
        this.self = this;
        var self = this;
        this.budgets = this.parameterService.getBudgets();
        console.log(this.budgets);
        this.router.queryParams.subscribe(
            (queryParams: any) =>{
                self.formin = queryParams;
                this.appService.serviceOrder(queryParams['budgetId']).subscribe(function(data){
                    self.serviceOrders = data;
                });
            }
        );
        
        this.soForm = this.formBuilder.group({
      });
        
    }
}