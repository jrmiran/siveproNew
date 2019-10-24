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
    currentDate: string = "01/01/2000";
    
  ngOnInit() {
  }
    
    clearField(){
        this.picker.select(undefined);
    }
    
    setValue(value: any){
        console.log(value);
        this.value = value;
        this.onChange(this.value);
    }
    
    writeValue(obj: any){
        this.value = obj;
    }
    
    registerOnChange(fn: any){
        console.log(fn);
        this.onChange = fn;
    }
    
    registerOnTouched(fn: any){
        
    }
    
    setDate(date: any){
        this.picker.select(date);
    }
    
    formatDate(date: Date) {
        if(date){
            if (date.getUTCMonth()+1 < 10){
                this.setValue(date.getUTCDate() + "/" + "0" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear());
                this.currentDate = date.getUTCDate() + "/" + "0" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear();
                console.log(this.currentDate);
            }else{
                this.setValue(date.getUTCDate() + "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear());
                this.currentDate = date.getUTCDate() + "/" + (date.getUTCMonth()+1) + "/" + date.getUTCFullYear();
                console.log(this.currentDate);
            }
        }
    }
}