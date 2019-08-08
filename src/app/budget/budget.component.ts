import { Component, OnInit, OnChanges, ViewChild, ElementRef} from '@angular/core';
import {RadioOption} from '../shared/radio/radio-option.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {StartService} from '../start.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { Select2OptionData } from 'ng2-select2';
import { BudgetService } from './budget.service';
import { BudgetNewComponent } from './budget-new/budget-new.component';
import { BudgetModel } from './budget.model';
import { AppService } from '../app.service';
import { timer } from 'rxjs/observable/timer';
import { Http, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import {AutoCompleteComponent} from '../shared/auto-complete/auto-complete.component';
import {NgxSpinnerService} from 'ngx-spinner';

const source = timer(1000);
@Component({
  selector: 'sivp-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit, OnChanges{
    @ViewChild('completo') completo: AutoCompleteComponent;
    @ViewChild('vendedores') vendedores: AutoCompleteComponent;
    orderForm: FormGroup;
    validateCliente: boolean;
    validateTerceiro: boolean;
    validateVendedor: boolean;
    public bnc: BudgetNewComponent;
    tipoCliente: RadioOption[] = [
        {label: 'Loja', value: 'LOJ'},
        {label: 'Cliente Físico', value: 'FIS'}
    ]
    clientsJuridicoObj: Object[];
    clientsFisicoObj: Object[];
    clientsArquitetoObj: Object[];
    clientsInput: Object[];
    terceirosObj: any[];
    vendedoresObj: any[];
    main: BudgetComponent;
    temp: string[];
    flag: boolean;
    showTerceiros: boolean = false;
    showVendedores: boolean = false;
    
    
    public formout2 = {type: "", client: "", vendor: "", thirdy: "", date: ""};
    //public formout: BudgetModel = {client: "me", date: "today", type: "physical", terceiro:"", vendor:"", valorTotal: 0, discount: 0, valorComDesconto: 0};
    
    public formout = {client: "me", date: "today", type: "physical", terceiro:"", vendor:"", valorTotal: 0, discount: 0, valorComDesconto: 0};
    constructor(private formBuilder: FormBuilder, private start: StartService, private budgetService: BudgetService, private appService: AppService, private spinner: NgxSpinnerService){}
    
    validateField(){
        var self = this;
        if(this.orderForm.value.tCliente == 'LOJ'){
            if(!this.clientsJuridicoObj){
                self.showSpinner(true, "spinnerCliente");
                this.appService.clientsJuridico().subscribe(function(clientsJuridico){
                    self.validateCliente = true;
                    self.validateTerceiro = true;
                    self.validateVendedor = true;
                    self.clientsJuridicoObj = clientsJuridico;
                    self.showSpinner(false, "spinnerCliente");
                });
            } else{
                    self.validateCliente = true;
                    self.validateTerceiro = true;
                    self.validateVendedor = true;
                    self.showSpinner(false, "spinnerCliente");
            }
        }else if(this.orderForm.value.tCliente == 'FIS'){
            this.showSpinner(true, "spinnerCliente");
            this.validateTerceiro = false;
            this.validateVendedor = false;
            if(!this.clientsFisicoObj){
                this.appService.clientsFisico().subscribe(function(clientsFisico){
                    self.validateCliente = true;
                    self.validateTerceiro = false;
                    self.validateVendedor = false;
                    self.clientsFisicoObj = clientsFisico;
                    self.showSpinner(false, "spinnerCliente");
                });
            } else{
                    self.validateCliente = true;
                    self.validateTerceiro = false;
                    self.validateVendedor = false;
                    self.showSpinner(false, "spinnerCliente");
            }   
        }
    }
    
    public setTerceiros(value: Object[]){
        this.terceirosObj = value;
        this.completo.options = this.terceirosObj;
        this.completo.inicia();
        this.showTerceiros = true;
        this.showSpinner(false, "spinnerTerceiro");
        console.log("TRUE");
    }
    
    public setVendedores(value: Object[]){
        this.vendedoresObj = value;
        this.vendedores.options = this.vendedoresObj;
        this.vendedores.inicia();
        this.showVendedores = true;
        this.showSpinner(false, "spinnerVendedor");
    }
    
    setFormout(){
        console.log("FORMOUT");
        this.formout.client = this.orderForm.value.cliente;
        this.formout.date = this.orderForm.value.data;
        this.formout.type = this.orderForm.value.tCliente;
        this.formout.terceiro = this.orderForm.value.terceiro;
        this.formout.vendor = this.orderForm.value.vendedor;
    }
    
    showSpinner(show: boolean, name: string){
        if(show){
            this.spinner.show(name);
        }else{
            this.spinner.hide(name);
        }
    }
    
    setFormout2(){
        console.log("FORMOUT2");
        this.formout2.client = this.orderForm.value.cliente;
        this.formout2.date = this.orderForm.value.data;
        this.formout2.type = this.orderForm.value.tCliente;
        this.formout2.thirdy = this.orderForm.value.terceiro;
        this.formout2.vendor = this.orderForm.value.vendedor;
    }
    
    setValidator(){
        const clienteControl = this.orderForm.get('cliente');
        const vendedorControl = this.orderForm.get('vendedor');
        const terceiroControl = this.orderForm.get('terceiro');
        var cInput = this.clientsInput;
        
        this.orderForm.get('tCliente').valueChanges.subscribe(tCliente=>{
            if (tCliente == 'LOJ'){
                clienteControl.setValidators([Validators.required]);
                vendedorControl.setValidators([Validators.required]);
                terceiroControl.setValidators([Validators.required]);
                this.clientsInput = this.clientsJuridicoObj;
            }
            if (tCliente == 'FIS'){
                clienteControl.setValidators([Validators.required]);
                vendedorControl.setValidators(null);
                terceiroControl.setValidators(null);
                this.clientsInput = this.clientsFisicoObj;
            }
            if (tCliente == 'ARQ'){
                clienteControl.setValidators([Validators.required]);
                vendedorControl.setValidators(null);
                terceiroControl.setValidators([Validators.required]);
                this.clientsInput = this.clientsArquitetoObj;
            } 
            
            clienteControl.updateValueAndValidity();
            vendedorControl.updateValueAndValidity();
            terceiroControl.updateValueAndValidity();
        });
    }
    
    nextLevel(){
        this.budgetService.nextLevelBudget(this.bnc, this.orderForm.value.data, this.orderForm.value.cliente, this.orderForm.value.terceiro, this.orderForm.value.vendedor);
    }
    
    ngOnInit() {   
        this.appService.loadPage();
        console.log(window.localStorage.getItem('authenticated'));
        var self = this;
        this.main = this;
        //this.showSpinner(true);
        
        /*this.appService.clientsJuridico().subscribe(function(clientsJuridico){
            self.clientsJuridicoObj = clientsJuridico
            self.showSpinner(false, "spinnerCliente");
        });
        this.appService.clientsFisico().subscribe(clientsFisico => this.clientsFisicoObj = clientsFisico);*/

        
        this.terceirosObj = [{nome:'', id:''}];
        this.vendedoresObj = [{nome:'', id:''}];
         
        this.orderForm = this.formBuilder.group({
            tCliente: this.formBuilder.control('', [Validators.required]),
            cliente: this.formBuilder.control('', [Validators.required]),
            vendedor: this.formBuilder.control('', [Validators.required]),
            terceiro: this.formBuilder.control('', [Validators.required]),
            data: this.formBuilder.control('', [Validators.required])
        })
        this.setValidator();

    }
    
    ngOnChanges() {                    

    }
}