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
    
    check2 = ['CHK1', 'CHK2', 'CHK3', 'CHK4'];
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    
    
    orderForm: FormGroup;
    filter: Object;
    p: Object;
    b: BudgetNew;
    
    openBudget(id: any){
        this.btc.openBudget(id);
    }
    
    addBudgetItem(id: string, item: string, valorUnitario: string){
        var self = this;
        this.bnc.setValue();
        this.comodos.forEach(function(comodo){
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
        self.budgetComponent.addItemBudget(self.b, self.bnc);
        });
    }
    
    openModalItem(id: number, descricao: string, valorUnitario: string){
        this.budgetItem.openModalFunction(true, id, descricao, valorUnitario);
    }
    
    eventRow(i:number){
        if(this.bnc){
            this.bnc.clickRow(i);
        }else if(this.itemButton){
            this.budgetItem.clickRow(i);
        }else if(this.budgetEdit){
            this.budgetEdit.clickRow(i);
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
