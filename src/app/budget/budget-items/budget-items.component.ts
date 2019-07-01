import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {Items} from './items.model'
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-budget-items',
  templateUrl: './budget-items.component.html',
  styleUrls: ['./budget-items.component.css']
})
export class BudgetItemsComponent implements OnInit {

  constructor(private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

    items: Object[];
    loadPage: boolean = false;
    self = this;
    openModal: boolean = false;
    id: number;
    descricao: string;
    valor: string;
    modalForm: FormGroup;
    currentItem: number;

    itemsObject: Items[] = [];
    
    openModalFunction(open: boolean, id?: number, descricao?: string, valor?: string){
        this.openModal = open;
        var self = this;
        
        if(open){
            this.id = id;
            this.descricao = descricao;
            this.valor = valor;
            
            console.log(id);
            this.modalForm.get('txtDescricao').setValue(this.descricao);
            this.modalForm.get('txtValor').setValue(this.valor);
        }
    }
    
    updateBudgetItem(){
        var self = this;
        
        this.appService.updateBudgetItem(this.id, this.modalForm.get('txtDescricao').value, this.modalForm.get('txtValor').value).subscribe(function(data){
            console.log(data);
            self.openModalFunction(false);
            self.itemsObject[self.currentItem].descricao = self.modalForm.get('txtDescricao').value;
            self.itemsObject[self.currentItem].valorUnitario = self.modalForm.get('txtValor').value.toFixed(2).replace('.',',');
        })
    }
    
    clickRow(i: number){
        this.currentItem = i;
    }
    
  ngOnInit() {
      this.spinner.show();
      /*var self = this;   
      this.appService.budgetItems().subscribe(function(budgetItems){
          self.items = budgetItems;
          self.itemsObject = Object.assign(self.itemsObject, self.items);
          self.loadPage = true;
      });
      
      this.modalForm = this.formBuilder.group({
            txtValor: this.formBuilder.control('', [Validators.required]),
            txtDescricao: this.formBuilder.control('', [Validators.required]),
      })*/
  }
}