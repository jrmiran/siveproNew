import { Component, OnInit, Input, Output } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormArray, Validators} from '@angular/forms';
@Component({
  selector: 'sivp-payroll-table',
  templateUrl: './payroll-table.component.html',
  styleUrls: ['./payroll-table.component.css']
})
export class PayrollTableComponent implements OnInit {

    constructor(private formBuilder: FormBuilder) { }
    
    // INPUTS --------------
    @Input() headers: string[] = [];
    @Input() datas: any[] = [];
    @Input() ids: any[] = [];
    @Input() formGroup: string = "";
    @Input() formArray: string = "";
    @Input() typePayment: string[] = [];
    @Input() payrollForm: FormGroup;
    // ---------------------
    
    ngOnInit() {
        
    }
}