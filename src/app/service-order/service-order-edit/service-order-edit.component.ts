import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';


@Component({
  selector: 'sivp-service-order-edit',
  templateUrl: './service-order-edit.component.html',
  styleUrls: ['./service-order-edit.component.css']
})
export class ServiceOrderEditComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

     serviceOrderForm: FormGroup;
    
    genericFunction(){
        console.log("Click");
    }
    
  ngOnInit() {
  }

}