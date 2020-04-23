import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, FormArray, Validators} from '@angular/forms';
import {AppService} from '../../app.service';

@Component({
  selector: 'sivp-edit-budget-v2',
  templateUrl: './edit-budget-v2.component.html',
  styleUrls: ['./edit-budget-v2.component.css']
})
export class EditBudgetV2Component implements OnInit {
    constructor(private appService: AppService, private formBuilder: FormBuilder) { }
    
    valueForm: FormGroup;
    
    updateTotalValue(){
        var params = {budgetId: parseFloat(this.valueForm.get('txtBudgetId').value), totalValue: parseFloat(this.valueForm.get('txtTotalValue').value)}
        this.appService.postUpdateTotalValueBudget(params).subscribe((data)=>{
            alert('Valor atualizado com sucesso');
        })    
    }
    
    ngOnInit() {
        this.valueForm = this.formBuilder.group({
            txtBudgetId: this.formBuilder.control('',[]),
            txtTotalValue: this.formBuilder.control('',[])
        })
        
    }

}
