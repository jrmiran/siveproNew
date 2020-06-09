import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import {ParameterService} from '../../shared/parameter.service';
import {FormControl, FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {BudgetV2PdfService} from '../../budget-v2/budget-v2-pdf.service';
import {ItemBudgetV2} from '../../budget-v2/item-budget.model';
import {ItemByAmbient} from '../../budget-v2/item-by-ambient.model';
import {BudgetV2} from '../../budget-v2/budget-v2.model';

@Component({
  selector: 'sivp-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService, public route: ActivatedRoute, private parameterService: ParameterService, private formBuilder: FormBuilder, private budgetPdf: BudgetV2PdfService) { }

    buds: Object[] = [];
    filteredBuds: Object[] = [];
    flag: boolean = true;
    n: number;
    budgetTest: Object[];
    self = this;
    filterForm: FormGroup;
    itemsBudget: ItemBudgetV2[] = [];
    itemByAmbient: ItemByAmbient[] = [];
    ambientsEdit: string[] = [];
    budget = {} as BudgetV2;
    store: any;
    client: any;
    seller: any;
    itemsBudgetParam: any;
    serviceOrders: any;
    
    openBudget(data: any){
        

        this.itemsBudget = [];
        this.itemByAmbient = [];
        this.ambientsEdit = [];

        
        var self = this;
        this.itemsBudgetParam = data['itemsBudget'];
        this.budget = data['budget'];
        this.store = data['store'];
        this.client = data['client'];
        this.seller = data['seller'];
        this.serviceOrders = data['serviceOrders'];
        this.assignItemsBudget().then((value)=>{
            this.separeteItemByAmbient().then((data)=>{
                self.budgetPdf.generatePDF(self.itemByAmbient, self.budget, self.store, self.client, self.seller, 'open');
            })
        })
        
    }
    
    separeteItemByAmbient(): Promise<any>{
        
        return new Promise((resolve, reject)=>{
            
            var self = this;
            var ambients: string[] = [];
            this.itemsBudget.forEach(function(data){
               if(data.item != "LINHA DE SEPARAÇÃO"){
                   if(ambients.indexOf(data.ambient) < 0){
                       ambients.push(data.ambient);
                   }
               } 
            });

            self.itemByAmbient = [];
            ambients.forEach(function(data){
                var items = {} as ItemByAmbient;
                items.ambientValue = 0;
                items.ambient = data;
                items.items = self.itemsBudget.filter((v) => {return v.ambient == data && v.item != "LINHA DE SEPARAÇÃO"});
                items.items.forEach(function(v){
                    items.ambientValue = self.appService.toFixed2(items.ambientValue + v.totalValue);
                });
                self.itemByAmbient.push(items);
            })

            self.ambientsEdit = ambients;

            resolve("Promise executada com sucesso!!");
            
        })
        
        
        
    }
    
    // FUNÇÃO QUE ATRIBUI VALORES DE ITEMSBUDGET RECEBIDOS POR PARAMETRO ------------
    assignItemsBudget(): Promise<any>{
        return new Promise((resolve, reject)=>{
            
            
        
            var totalValue: number = 0;
            this.itemsBudgetParam.forEach((v)=>{
                var item = {} as ItemBudgetV2;
                item.id = v['id'];
                item.qtd = parseFloat(v['quantidade']);
                item.cod = v['codigo'];
                item.item = v['item'];
                item.detail = v['detalhe'];
                item.measure = v['medida'];
                item.ambient = v['comodo'];
                item.necessary = v['necessario'];
                item.unitValue = this.appService.toFixed2(parseFloat(v['valorUnitario']));
                item.totalValue = this.appService.toFixed2(parseFloat(v['valorTotal']));
                item.discount = parseFloat(v['desconto']);
                item.discountValue = this.appService.toFixed2(parseFloat(v['valorComDesconto']));
                item.number = v['numero'];
                item.serviceOrderId = this.serviceOrders.find((d)=>{return d['itemOrcamento_id'] == item.id}) ? parseFloat(this.serviceOrders.find((d)=>{return d['itemOrcamento_id'] == item.id})['id']) : 0;
                totalValue = totalValue + item.totalValue;
                this.itemsBudget.push(item);
            });
            //this.budget.totalValue = totalValue;
            /*this.sortItems();
            this.separeteItemByAmbient();
            this.ambientsEdit.forEach((v) => {
                this.addAmbient(v);
            })*/
            resolve('sucesso');
        })
    }
    // ------------------------------------------------------------------------------------------------
    
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
                    
                    self.filteredBuds = this.buds;
                    self.filterForm.get('cbStatus')['controls'].forEach((data, index)=>{
                        if(!data['value']){
                            document.getElementById('cb' + index).click();
                        }
                    })
                });
            
            window.sessionStorage.setItem('budgetsTable', JSON.stringify(self.buds));
            } else{
                this.appService.budgets().subscribe(function(budgets){
                    self.buds = budgets;
                    self.buds.forEach(function(data){
                       data['approved'] =  data['approved']['data'][0];
                    });
                    self.spinner.hide();
                    window.sessionStorage.setItem('budgetsTable', JSON.stringify(self.buds));
                    
                    self.filteredBuds = self.buds;
                    self.filterForm.get('cbStatus')['controls'].forEach((data, index)=>{
                        if(!data['value']){
                            document.getElementById('cb' + index).click();
                        }
                    })
                });
            }
    }
    
    fixBudgetValues(){
        this.spinner.show();
        var budgets: any;
        var current: any;
        var total = 0;
        this.appService.postSearchBudgetTable({}).subscribe((data)=>{
            budgets = data[1];
            
            for (let i = 2500; i < 3000; i++) {
                total = 0;
                current = budgets.filter((v)=>{return v['orcamento_id'] == i});
                if(current.length > 0){
                    current.forEach((v, index)=>{
                        total = total + parseFloat(v['valorTotal'].replace(',','.'));
                    })
                   this.appService.postUpdateTotalValueBudget({budgetId: i, totalValue: this.appService.toFixed2(total)}).subscribe((value)=>{
                    })
                }
                
                
            }
            
            this.spinner.hide();
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
                this.n ++;
            })
        );
    }
}