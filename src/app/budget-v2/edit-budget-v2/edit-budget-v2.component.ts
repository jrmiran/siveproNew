import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {ItemBudgetV2} from '../item-budget.model';
import {BudgetV2} from '../budget-v2.model';

@Component({
  selector: 'sivp-edit-budget-v2',
  templateUrl: './edit-budget-v2.component.html',
  styleUrls: ['./edit-budget-v2.component.css']
})

export class EditBudgetV2Component implements OnInit {
    constructor(private appService: AppService, private formBuilder: FormBuilder) { }
    
    valueForm: FormGroup;
    items: any[] = [];
    itemsBudget: ItemBudgetV2[] = [];
    budget: BudgetV2;
    
    updateTotalValue(){
        var params = {budgetId: parseFloat(this.valueForm.get('txtBudgetId').value), totalValue: parseFloat(this.valueForm.get('txtTotalValue').value)}
        this.appService.postUpdateTotalValueBudget(params).subscribe((data)=>{
            alert('Valor atualizado com sucesso');
        })    
    }
    
    findItemsBudget(){
        this.appService.budgetEdit(this.valueForm.get('txtBudgetId').value).subscribe((data)=>{
            this.items = data;
            console.log(this.items);
            this.items[1].forEach((v, index)=>{
                var item = {} as ItemBudgetV2;
                
                item.ambient = v['comodos'];
                item.cod = this.items[2][index]['codigos'];
                item.detail = this.appService.replaceAll(this.appService.replaceAll(this.items[3][index]['detalhes'], "QUEBRADELINHA", String.fromCharCode(10)), "%2F", "/");
                item.discount = this.items[10][0]['desconto'] == null ? 0 : parseFloat(this.items[10][0]['desconto'].replace(',','.'));
                item.discountValue = this.appService.discountValue(parseFloat(this.items[9][index]['valores']), item.discount);
                item.item = this.appService.replaceAll(this.items[4][index]['itens'], "%2F", "/");
                item.measure = this.appService.replaceAll(this.appService.replaceAll(this.items[5][index]['medidas'], "QUEBRADELINHA", String.fromCharCode(10)), "%2F", "/");
                item.necessary = this.appService.replaceAll(this.appService.replaceAll(this.items[6][index]['necessidades'], "QUEBRADELINHA", String.fromCharCode(10)), "%2F", "/");
                item.number = 0;
                item.qtd = parseFloat(this.items[8][index]['quantidades'].replace(',','.'));
                item.totalValue = parseFloat(this.items[9][index]['valores'].replace(',','.'));
                item.unitValue = item.totalValue / item.qtd;
                item.serviceOrderId = 0;
                this.itemsBudget.push(item);
            })
            
            var b = {} as BudgetV2;
            b.date = this.appService.replaceAll(this.items[10][0]['data'], "%2F", "/");
            b.note = this.items[10][0]['observacao'] == null ? " " : this.appService.replaceAll(this.appService.replaceAll(this.items[10][0]['observacao'], "%2F", "/"), "QUEBRADELINHA", String.fromCharCode(10));
            b.id = this.items[10][0]['id'];
            b.totalValue = parseFloat(this.items[10][0]['valorTotal'].replace(',','.'));
            console.log(this.items[10][0]['valorTotal']);
            console.log(b.totalValue);
            this.budget = b;
            this.appService.postFixBudget({budget: this.budget, items: this.itemsBudget}).subscribe((data)=>{
                alert("Sucesso");
            })
        })
        
    }
    
    ngOnInit() {
        this.valueForm = this.formBuilder.group({
            txtBudgetId: this.formBuilder.control('',[]),
            txtTotalValue: this.formBuilder.control('',[])
        })
    }
}