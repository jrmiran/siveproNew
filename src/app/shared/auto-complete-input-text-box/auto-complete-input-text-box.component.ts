import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OptionModel} from './auto-complete-input-text-box.model';


@Component({
  selector: 'sivp-auto-complete-input-text-box',
  templateUrl: './auto-complete-input-text-box.component.html',
  styleUrls: ['./auto-complete-input-text-box.component.css'],
    providers:[
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteInputTextBoxComponent),
            multi: true
        }
    ]
})
export class AutoCompleteInputTextBoxComponent implements OnInit, ControlValueAccessor{
    myControl = new FormControl();
    @Input() options: string[] = ['One', 'Two', 'Three'];
    @Input() placeholder: string = "Clique aqui";
    filteredOptions: Observable<string[]>;
    value: any;
    onChange: any;
    
    
    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

    private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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
