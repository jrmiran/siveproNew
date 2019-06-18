import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import {BudgetNewComponent} from '../budget/budget-new/budget-new.component';
import {BudgetService} from '../budget/budget.service';
import {BudgetNew} from '../budget/budget-new/budget-new.model';
import {CheckBox} from '../shared/check/check-box.model';
import {StartService} from '../start.service';
import {AppService} from '../app.service';
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
    @Input() buttonOption: boolean = false;
    @Input() check: string[];
    @Input() enableButton: boolean;
    @Input() comodos: string[];
    check2 = ['CHK1', 'CHK2', 'CHK3', 'CHK4'];
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    @Input() budgetTable: boolean = false;
    
    orderForm: FormGroup;
    filter: Object;
    p: Object;
    b: BudgetNew;
    
    
    

    
    addBudgetItem(id: string, item: string){
        this.bnc.setValue();
        let bb = this.b;
        let bc = this.budgetComponent;
        let bncc = this.bnc;
        this.comodos.forEach(function(comodo){
            bb = {
            qtd: 1,
            cod: id,
            item: item,
            detalhe: "",
            medida: "",
            comodo: comodo,
            necessario: "",
            valorUnitario: 0,
            valorTotal: 0,
            desconto: 0,
            valorComDesconto: 0    
        }
        bc.addItemBudget(bb, bncc);
        });
        //console.log(this.comodos);
        
    }
    
    
    eventRow(i:number){
        if(this.budgetTable){
            this.bnc.clickRow(i);
        }else{
            //console.log("OK");
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
    
    
    /*pageChanged($event){
        this.numberOfPage = this.numberOfPage + 1;
    }*/

}
