import { Component, OnInit, forwardRef, ViewChild } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'sivp-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
    providers:[
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ]
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  constructor() { }
    
    value: any;
    onChange: any;
    @ViewChild('picker') picker: any;
    
  ngOnInit() {
  }
    
    clearField(){
        this.picker.select(undefined);
    }
    
    setValue(value: any){
        console.log("VALUE");
        this.value = value;
        this.onChange(this.value);
    }
    
    writeValue(obj: any){
        this.value = obj;
    }
    
    registerOnChange(fn: any){
        this.onChange = fn;
    }
    
    registerOnTouched(fn: any){
        
    }
    
    formatDate(date: Date) {
        if(date){
            if (date.getUTCMonth()+1 < 10){
                this.setValue(date.getUTCDate() + "/" + "0" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear());
            }else{
                this.setValue(date.getUTCDate() + "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear());
            }
        }
    }
}