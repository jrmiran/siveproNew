import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import {BudgetNewComponent} from '../budget/budget-new/budget-new.component';
import {BudgetTableComponent} from '../budget/budget-table/budget-table.component';
import {BudgetService} from '../budget/budget.service';
import {BudgetNew} from '../budget/budget-new/budget-new.model';
import {CheckBox} from '../shared/check/check-box.model';
import {StartService} from '../start.service';
import {AppService} from '../app.service';
import {BudgetItemsComponent} from '../budget/budget-items/budget-items.component';
import {BudgetEditComponent} from '../budget/budget-edit/budget-edit.component';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {ServiceOrderComponent} from '../service-order/service-order.component';

import "rxjs/add/operator/map";

@Component({
  selector: 'sivp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  constructor(private budgetComponent: BudgetService, private start: StartService, private formBuilder: FormBuilder) { }

    @Input() name: string;
    @Input() headers: string[];
    @Input() datas: Array<Object>;
    @Input() ids: string[];
    @Input() searchBar: string = "true";
    @Input() bnc: BudgetNewComponent;
    @Input() btc: BudgetTableComponent;
    @Input() buttonOption: boolean = false;
    @Input() check: string[];
    @Input() enableButton: boolean;
    @Input() comodos: string[];
    @Input() itemButton: boolean = false;
    @Input() ipp: number = 10;
    @Input() showPagination: boolean = true;
    @Input() budgetTable: boolean = false;
    @Input() budgetItem: BudgetItemsComponent;
    @Input() budgetEdit: BudgetEditComponent;
    @Input() runClickRow: boolean = true;
    @Input() dropdownButton: boolean = false;
    @Input() soc: ServiceOrderComponent;
    @Input() multipleRowsSelection: boolean = false;
    @Input() selectionButton: boolean = false;
    
    check2 = ['CHK1', 'CHK2', 'CHK3', 'CHK4'];
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    
    currentLine: number = -1;
    orderForm: FormGroup;
    filter: Object;
    p: Object;
    b: BudgetNew;
    selectedRows: number[] = [];
    
    selectAll(){    
        var self = this;
        if (this.selectedRows.length > 0){
            this.selectedRows = [];
            if(this.soc){
                this.soc.clickRow(this.selectedRows);
            }
        } else{
            this.datas.forEach(function(data, index){
                 self.selectedRows.push(index);
                if(self.soc){
                    self.soc.clickRow(self.selectedRows);
                }
            });
        }
    }
    
    openBudget(id: any){
        this.btc.openBudget(id);
    }
    
    changeBudgetStatus(id: number, status: boolean){
        console.log(id);
        this.budgetComponent.changeBudgetStatus(id, status, this.btc);
    }
    
    addBudgetItem(id: string, item: string, valorUnitario: string){
        var self = this;
        console.log("entrou no addbudgeitem");
        if(self.bnc){
            console.log("Entrou no if linha 58");
            self.bnc.setValue();
        } else if(self.budgetEdit){
            console.log("Entrou no else if linha 60");
            self.budgetEdit.setValue();
        }
        
        this.comodos.forEach(function(comodo){
            console.log("entrou no for each");
            self.b = {
            qtd: 1,
            cod: id,
            item: item,
            detalhe: "",
            medida: "",
            comodo: comodo,
            necessario: "",
            valorUnitario: valorUnitario,
            valorTotal: valorUnitario,
            desconto: 0,
            valorComDesconto: 0    
        }
        if(self.bnc){
            console.log("Entrou no if");
           self.budgetComponent.addItemBudget(self.b, self.bnc);
        }else if(self.budgetEdit){
            console.log("Entrou no else if");
            self.budgetComponent.addItemEditBudget(self.b, self.budgetEdit);
        }
        });
    }
    
    openModalItem(id: number, descricao: string, valorUnitario: string){
        this.budgetItem.openModalFunction(true, id, descricao, valorUnitario);
    }
    
    selectRow(i: number): Boolean{
        if(this.selectedRows.indexOf(i) != -1){
           return true;
        }else{
            return false;
        }
    }
    
    eventRow(i:number){
        if(this.runClickRow){
            if(!this.multipleRowsSelection){
                console.log("1");
                this.selectedRows = [];
            }
            if(this.selectedRows.indexOf(i) != -1){
                console.log("2");
                this.selectedRows = this.selectedRows.slice(0,this.selectedRows.indexOf(i)).concat(this.selectedRows.slice(this.selectedRows.indexOf(i)+1,this.selectedRows.length));
                //this.selectedRows = this.selectedRows.splice(this.selectedRows.indexOf(i));
            } else{
                console.log("3");
                this.selectedRows.push(i);
            }
            
            if(this.bnc){
                console.log("bnc");
                this.bnc.clickRow(i);
            }else if(this.itemButton){
                console.log("itemButton");
                this.budgetItem.clickRow(i);
            }else if(this.budgetEdit){
                console.log("budgetEdit");
                this.budgetEdit.clickRow(i);
            }else if(this.soc){
                this.soc.clickRow(this.selectedRows);
            } 
            this.currentLine = i;
        
        
        
        
        }
        

                
    }
    
    buildComodos(){
        const values = this.check2.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    
    ngOnInit() {
        this.start.start();
        this.orderForm = this.formBuilder.group({
            checkBoxOption: this.buildComodos()
        })
    }
}
