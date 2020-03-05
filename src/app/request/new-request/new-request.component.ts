import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {DatePickerComponent} from '../../shared/date-picker/date-picker.component';
import {RadioOption} from '../../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import {NewRequestBudgets} from './new-request-budgets.model';

@Component({
  selector: 'sivp-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {

    constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
    
    /* START VARIABLES */
    budgetsStore: Object[] = [];
    requests: Object[] = [];
    newRequestForm: FormGroup;
    self: any;
    stores: Object[] = [];
    keyword = 'nome';
    itemsBudget: Object[] = [];
    newRequestBudgets: NewRequestBudgets[] = [];
    headerTable: string[] = ['Qtd', 'Código', 'Item', 'Detalhe', 'Medida', 'Ambiente', 'Necessario', 'Valor Unit.', 'Valor Total', 'Desconto', 'Valor c/ Desc.'];
    idItemBudget: string[] = ['quantidade', 'codigo', 'item', 'detalhe', 'medida', 'comodo', 'necessario', 'valorUnitario', 'valorTotal', 'desconto', 'valorComDesconto'];
    sizeNewRequestBudgets: number;
    requestValue: number;
    clientId: any;
    /* END VARIABLES */
    
    
    
    /* START FUNCTIONS */
    selectEvent(item) {
        // do something with selected item
        console.log(item);
        this.clientId = item['id'];
        var self = this;
        this.appService.postSearchBudgetByStoreId(item).subscribe(function(data){
            console.log(data);
            data.map(function(value){
              if (value['desconto'] == null){
                  value = '0';
              }  
            })
            self.budgetsStore = data;
            self.budgetsStore.map((v) => {if(v['desconto'] == null){v['desconto'] = "0"}});
            console.log(self.budgetsStore);
        });
    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e){
        // do something when input is focused
        console.log(e); 
    }
    
    addBudgetRequest(id: any){
        this.spinner.show();
        var self = this;
        var params = {budgetId: id};
        
        this.appService.postSearchBudgetItemByBudget(params).subscribe(function(data){
            let newRequestBudget = {} as NewRequestBudgets;
            newRequestBudget.budgetId = id;
            newRequestBudget.budgetItems = data;
            newRequestBudget.totalValue = parseFloat(parseFloat(self.budgetsStore.find((v) => v['id'] == id)['valorTotal'].replace(',','.')).toFixed(2));
            newRequestBudget.discount = self.budgetsStore.find((v) => v['id'] == id)['desconto'];
            newRequestBudget.clientId = self.budgetsStore.find((v) => v['id'] == id)['clienteEmpresaa_id'];
            newRequestBudget.discountValue = parseFloat((newRequestBudget.totalValue - (newRequestBudget.totalValue * (parseFloat(newRequestBudget.discount) / 100))).toFixed(2));
            self.newRequestBudgets.push(newRequestBudget);
            console.log(self.newRequestBudgets);
            console.log(data);
            self.updateRequestValue();
            self.spinner.hide();
        });
        
    }
    
    removeItem(budgetId: any, budgetItemId: any){
        var rem = this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['budgetItems'].find((v) => {return v['id'] == budgetItemId});
        this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['budgetItems'] = this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['budgetItems'].filter((v) => v != rem);
        this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['totalValue'] = parseFloat((this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['totalValue'] - parseFloat(rem['valorTotal'])).toFixed(2));
        this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['discountValue'] = parseFloat((this.newRequestBudgets.find((v) => {return v.budgetId == budgetId})['discountValue'] - parseFloat(rem['valorComDesconto'])).toFixed(2));
        this.updateRequestValue();
    }
    
    updateRequestValue(){
        var self = this;
        self.requestValue = 0;
        self.newRequestBudgets.forEach(function(data){
            self.requestValue = self.requestValue + data['discountValue'];
        });
        self.requestValue = parseFloat(self.requestValue.toFixed(2));
    }
    
    processRequest(){
        var self = this;
        this.spinner.show();
        var query = "(" + this.clientId + ", " + this.requestValue + ", '" + this.newRequestForm.get('txtDate').value + "', '" + this.newRequestForm.get('txtPaymentDate').value + "', '" + this.newRequestForm.get('txtNote').value + "')";
        var clients: any[] = [];
        var budgets: any[] = [];
        var itemsBudgets: any[] =[];
        this.newRequestBudgets.forEach(function(data){
            clients.push(data['clientId']);
            budgets.push(data['budgetId']);
            data['budgetItems'].forEach(function(value){
                itemsBudgets.push(value['id']);
            })
        });
        var params = {query: query, clients: clients, budgets: budgets, itemsBudgets: itemsBudgets}

        console.log(params);
        
        this.appService.postInsertRequest(params).subscribe(function(data){
            console.log(data);
            alert("Pedido Cadastrado Com Sucesso!");
            self.spinner.hide();
        })
        
    }
    /* END FUNCTIONS */
    
    
    ngOnInit() {
        var self = this;
        this.self = this;

        this.newRequestForm = this.formBuilder.group({
            txtStore: this.formBuilder.control('',[]),
            txtDate: this.formBuilder.control('',[]),
            txtPaymentDate: this.formBuilder.control('',[]),
            txtNote: this.formBuilder.control('',[]),
        });
        
        this.appService.postSearchStore().subscribe(function(data){
            self.stores = data;
        });
    }

}
