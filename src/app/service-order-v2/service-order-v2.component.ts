import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import {BudgetV2} from '../budget-v2//budget-v2.model';
import {ItemBudgetV2} from '../budget-v2/item-budget.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-service-order-v2',
  templateUrl: './service-order-v2.component.html',
  styleUrls: ['./service-order-v2.component.css']
})
export class ServiceOrderV2Component implements OnInit {
    
    constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

    // PARAMS ----------------------------
    budget: BudgetV2;
    itemsBudget: ItemBudgetV2[];
    client: any;
    store:  any;
    seller:  any;
    // -----------------------------------
    
    // VARIABLES -------------------------
    serviceOrders: any = [];
    execution: any;
    main: any;
    selectedRows: number[];
    selectedItems: number[];
    newServiceOrderForm: FormGroup;
    // -----------------------------------
    
    // FUNÇÃO QUE SELECIONA LINHAS DO MODAL DE SELEÇÃO DE ITENS -------------------------------------
    clickRow(ids: number[]){
        this.selectedItems = [];
        this.selectedRows = ids;
        this.selectedRows.forEach((v) => {
            this.selectedItems.push(this.itemsBudget[v].id);
        })
    }
    // ----------------------------------------------------------------------------------------------
    
    // FUNÇÃO DO BOTÃO 'OK' DO MODAL DE INSERÇÃO DE OS ----------------------------------------------
    okButtonModal(e){
        var self = this;
        this.spinner.show();
        var params = {items: this.selectedItems, budgetId: this.budget.id};
        this.appService.postInsertServiceOrder(params).subscribe(function(data){
            self.appService.postSearchServiceOrderByBudget({budgetId: self.budget.id}).subscribe(function(v){
                alert("Ordens de serviço adicionadas!");
                self.serviceOrders = v;
                self.spinner.hide();
            });
        })
    }
    // ----------------------------------------------------------------------------------------------
    
    
    ngOnInit() {
        var self = this;
        this.main = this;
        this.route.queryParams.subscribe((queryParams: any) => {
            this.budget = JSON.parse(queryParams['budget']);
            this.itemsBudget = JSON.parse(queryParams['itemsBudget']);
            this.client = JSON.parse(queryParams['client']);
            this.store = JSON.parse(queryParams['store']);
            this.seller = JSON.parse(queryParams['seller']);
        })
        
        this.appService.postSearchServiceOrderByBudget({budgetId: this.budget.id}).subscribe(function(data){
            self.serviceOrders = data;
        });
        
        this.newServiceOrderForm = this.formBuilder.group({
            txtDate: this.formBuilder.control('', [Validators.required])
        })
    }
}