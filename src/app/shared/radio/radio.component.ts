import { Component, OnInit, Input, forwardRef} from '@angular/core';
import {RadioOption} from './radio-option.model';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {StartService} from '../../start.service';

@Component({
  selector: 'sivp-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
    providers:[
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioComponent),
            multi: true
        }
    ]
})
export class RadioComponent implements OnInit, ControlValueAccessor{
    
    @Input() options: RadioOption[]
    value: any;
    onChange: any;
    constructor(private start: StartService) { }

  ngOnInit() {
      //this.start.start();
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
