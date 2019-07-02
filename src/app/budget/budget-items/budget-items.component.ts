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
            this.modalForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.valor));
        }
    }
    
    updateBudgetItem(){
        var self = this;
        
        this.appService.updateBudgetItem(this.id, this.modalForm.get('txtDescricao').value, this.appService.converteFloatMoeda(this.modalForm.get('txtValor').value)).subscribe(function(data){
            console.log(data);
            self.openModalFunction(false);
            
            self.itemsObject[self.findIndex(self.id)].descricao = self.modalForm.get('txtDescricao').value;
            self.itemsObject[self.findIndex(self.id)].valorUnitario = self.appService.converteFloatMoeda(self.modalForm.get('txtValor').value);
        })
    }
    
    clickRow(i: number){
        this.currentItem = i;
    }
    
    showSpinner(show: boolean){
        if(show){
            this.spinner.show();
        }else{
            this.spinner.hide();
        }
    }
    
    findIndex(id: number): number{
        var response: number = -1;
        this.itemsObject.forEach(function(data, index){
            if(data.id == id){
                response = index;
            }
        });
        return response;
    }
    
  ngOnInit() {
      setTimeout(() => this.showSpinner(true), 10);
      var self = this;   
      
      this.appService.budgetItems().subscribe(function(budgetItems){
          self.items = budgetItems;
          self.itemsObject = Object.assign(self.itemsObject, self.items);
          self.loadPage = true;
          self.showSpinner(false);
      });
      
      this.modalForm = this.formBuilder.group({
            txtValor: this.formBuilder.control('', [Validators.required]),
            txtDescricao: this.formBuilder.control('', [Validators.required]),
      })
  }
}