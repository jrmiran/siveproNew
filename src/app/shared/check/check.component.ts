import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CheckBox} from './check-box.model';

@Component({
  selector: 'sivp-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
        providers:[
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckComponent),
            multi: true
        }
    ]
})
export class CheckComponent implements OnInit, ControlValueAccessor {

    @Input() options: CheckBox[];
    value: any;
    onChange: any;

    
    constructor() { }

    ngOnInit() {
    }
    
    setValue(value: any){
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

}
