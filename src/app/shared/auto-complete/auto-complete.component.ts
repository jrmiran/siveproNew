import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OptionModel} from '../auto-complete-input-text-box/auto-complete-input-text-box.model'
import { AppService } from '../../app.service';
import {BudgetComponent} from '../../budget/budget.component'

@Component({
  selector: 'sivp-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
    providers:[
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutoCompleteComponent),
            multi: true
        }
    ]
})

export class AutoCompleteComponent implements OnInit, ControlValueAccessor{
    constructor(private appService: AppService){}
    myControl = new FormControl();
    @Input() options: OptionModel[] = [{nome:"Nome1", id:0}, {nome:"Nome2", id:0}, {nome:"Cliente3", id:0}];
    @Input() placeholder: string = "Clique aqui";
    optionsString: string[] = [];
    idsNumber: number[] = [];
    filteredOptions: Observable<String[]>;
    value: any;
    @Input() onChange: any;
    @Input() nomeCliente: string;
    @Input() bco: BudgetComponent;
    @Input() typeInput: string;
    
    
    public objs: Object[];
    

    public inicia(){
        var opString = this.optionsString;
        var idsNumber = this.idsNumber;
        this.options.forEach(function(value){
            opString.push(value.nome); 
        });
        this.optionsString = opString;
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }
    
    ngOnInit() {
       this.inicia();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.optionsString.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }
    
    public switchClientEmpresa(value: string){
        this.appService.clientsEmpresa(`'${value}'`).subscribe(clientsEmpresa => this.objs = clientsEmpresa);
    }
    
    public getObjs(): Object[]{
        return this.objs;
    }

    setValue(value: any){
        this.value = value;
        this.onChange(this.value);
        if(this.typeInput = "Client"){
            this.appService.clientsEmpresa(`'${value}'`).subscribe(clientsEmpresa => this.bco.setTerceiros(clientsEmpresa));
            this.appService.vendorEmpresa(`'${value}'`).subscribe(vendorEmpresa => this.bco.setVendedores(vendorEmpresa));
        }
        this.bco.setFormout2();
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