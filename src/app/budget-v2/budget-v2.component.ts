import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {BudgetParameterModel} from './budget-parameter.model';

@Component({
  selector: 'sivp-budget-v2',
  templateUrl: './budget-v2.component.html',
  styleUrls: ['./budget-v2.component.css']
})
export class BudgetV2Component implements OnInit {

    constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
    
    spinnerText: string = "";
    
    stores: any = [];
    clients: any = [];
    sellers: any = [];
    
    // ATRIBUTOS QUE DEVEM APARECER NO INPUT LIST
    keywordStore = 'nome';
    keywordClient = 'nome';
    keywordSeller = 'nome';
    
    //FORM
    budgetForm: FormGroup
    
    //PARÂMETROS QUE PASSARÃO PARA O ORÇAMENTO
    client: any;
    seller: any;
    store: any;
    date: any;
    params = {} as BudgetParameterModel;
    
    // -----------------------------------------    INPUT LIST FUNCTIONS -------------------------------
    selectEventStore(item) {
        var self = this;
        this.spinnerText = "Carregando Clientes e Vendedores";
        this.spinner.show();
        
        this.appService.postSearchClientAndSellerByStore({storeId: item['id']}).subscribe(function(data){
            self.clients = data[0];
            self.sellers = data[1];
            self.spinner.hide();
        })
        
        this.store = item;
        this.params.store = JSON.stringify(this.store);
    }
    
    selectEventClient(item) {
        this.client = item;
        this.params.client = JSON.stringify(this.client);
    }
    
    selectEventSeller(item) {
        this.seller = item;
        this.params.seller = JSON.stringify(this.seller);
    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
        this.seller = '';
        this.params.seller = '';
        this.budgetForm.get('txtSeller').setValue('');
        
        this.client = '';
        this.params.client = '';
        this.budgetForm.get('txtClient').setValue('');
    }

    onFocused(e){
        // do something when input is focused
        console.log(e); 
    }
    
    // -----------------------------------------    INPUT LIST FUNCTIONS -------------------------------
    
    nextStep(){
        this.params = {client: this.client, seller: this.seller, store: this.store, date: this.date, budget: "{}"};
        console.log(this.params);
        this.router.navigate(['/newBudgetV2', this.params]);
    }
    
    ngOnInit() {
        var self = this;
        setTimeout(()=>{
            this.spinnerText = "Carregando Clientes";
            this.spinner.show()
        }, 10)
        
        this.params.budget = "{}";
        
        this.budgetForm = this.formBuilder.group({
            txtDate: this.formBuilder.control('', [Validators.required]),
            txtStore: this.formBuilder.control('', [Validators.required]),
            txtSeller: this.formBuilder.control('', [Validators.required]),
            txtClient: this.formBuilder.control('', [Validators.required])
        })
        
        this.budgetForm.get('txtDate').valueChanges.subscribe(function(data){
            self.date = data;
            self.params.date = self.date;
        });
        
        
        this.appService.postSearchAllStore().subscribe(function(data){
            self.stores = data;
            self.spinner.hide();
        })
        
    }
}