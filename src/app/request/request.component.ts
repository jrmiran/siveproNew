import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {DatePickerComponent} from '../shared/date-picker/date-picker.component';
import {RadioOption} from '../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sivp-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

    constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
    
    /* START VARIABLES */
    requests: Object[] = [];
    newRequestForm: FormGroup;
    stores: Object[] = [];
    keyword = 'nome';
    /* END VARIABLES */
    
    
    /* START FUNCTIONS */
    selectEvent(item) {
        // do something with selected item
        console.log(item['id']);
    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e){
        // do something when input is focused
        console.log(e); 
    }
    /* END FUNCTIONS */
    
    
    
    ngOnInit() {
        var self = this;
        /*this.appService.postSearchAllRequests().subscribe(function(data){
           self.requests = data; 
        });*/
        this.appService.postSearchStore().subscribe(function(data){
            self.stores = data;
        })
        
        this.newRequestForm = this.formBuilder.group({
            txtStore: this.formBuilder.control('',[]),
            txtDate: this.formBuilder.control('',[]),
            txtPaymentDate: this.formBuilder.control('',[]),
            txtNote: this.formBuilder.control('',[]),
            
        });
      
        
        
        
        
    }

}
