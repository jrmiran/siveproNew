import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ExecutionServiceOrder} from '../service-order-execution-v2.model';
import {Employee} from '../employee.model';

@Component({
  selector: 'sivp-service-order-table-v2',
  templateUrl: './service-order-table-v2.component.html',
  styleUrls: ['./service-order-table-v2.component.css']
})
export class ServiceOrderTableV2Component implements OnInit {

    constructor(private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }
    
    // VARIABLES -------------
    spinnerText: string = '';
    serviceOrders: any = [];
    self: any;
    employees: Employee[] = [];
    selectedEmployees: Employee[] =  [];
    releaseModal = false;
    executions: ExecutionServiceOrder[] = [];
    showInputs: boolean[] = [];
    showStoneValueInput: boolean = false;
    selectedServiceOrder: any;
    enableOkButton: boolean = false;
    selectedSO: number;
    valueSO: string = '';
    titleModal: string = '';
    idsInput: string[] = [];
    // -----------------------
    
    // FORM VARIABLES ----------------
    serviceOrderForm: FormGroup;
    employeesForm: FormArray;
    percentagesForm: FormArray;
    empreitasForm: FormArray;
    // -------------------------------
    
    // FUNÇÃO QUE ABRE O MODAL PARA ALTERAR SO CHAMADA PELA TABLE ---------------------
    openModalChangeSO(id){
        this.selectedSO = id;
        document.getElementById('openModalButton').click();
        this.serviceOrderForm.get('cbEmployees')['controls'].forEach((v, index)=>{
            if(v['value']['employeeName']){
                document.getElementById(this.idsInput[index]).click();
            }
        })
        this.serviceOrderForm.get('txtDate').setValue('');
        this.selectedServiceOrder = this.serviceOrders.find((v) =>{
            return v['id'] == id
        })
        this.valueSO = this.appService.converteFloatMoeda(parseFloat(this.selectedServiceOrder['valorComDesconto']));
        this.titleModal = "Alteração Ordem de Serviço: " + id + "\nValor: " + this.valueSO;
    }
    // --------------------------------------------------------------------------------
    
    // FUNÇÃO DO BOTÃO 'OK' DO MODAL DE ALTERAÇÃO DO SO -------------------------------
    submitServiceOrderExecution(e){
        this.executions = [];
        var stoneValue = this.appService.toFixed2(parseFloat(this.serviceOrderForm.get('stoneValue').value) / this.selectedEmployees.length);
        this.employees.forEach((data, index) =>{
            if(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeName'].value){
                var exec = {} as ExecutionServiceOrder;
                exec.employeeId = data.id;
                exec.employeeShare = parseFloat(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeShare'].value);
                exec.empreitaValue = parseFloat(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeEmpreita'].value);
                exec.empreita = exec.empreitaValue > 0 ? 1 : 0;
                exec.endDate = this.serviceOrderForm.get('txtDate').value;
                exec.stoneValue = stoneValue;
                exec.stone = exec.stoneValue > 0 ? 1 : 0;
                exec.empreitaPaymentDate = '';
                exec.serviceOrderId = this.selectedServiceOrder['id'];
                exec.startDate = '';
                this.executions.push(exec);
            }
        })
        this.appService.postInsertExecutionServiceOrder({execution: this.executions}).subscribe((data) =>{
            alert("Ordem de serviço lançada!");
            console.log(data);
        })
        
    }
    // --------------------------------------------------------------------------------
    
    // FUNÇÃO QUE CONSTRÓI OS FORMS DE NOME, PORCENTAGEM E EMPREITA DOS FUNCIONÁRIOS --
    buildEmployeesForm(){
        this.employees.forEach((v, index) =>{
            this.employeesForm.push(new FormGroup({
                employeeName: new FormControl(false, []),
                employeeShare: new FormControl('100',[]),
                employeeEmpreita: new FormControl('0',[])
            }));
            this.idsInput.push("cb" + index);
            this.showInputs.push(false);
        })
    }
    // --------------------------------------------------------------------------------
    
    // FUNÇÃO QUE VALIDA OS DADOS DO MODAL PARA HABILITAR BOTÃO 'OK' ------------------
    validateForm(){
        var percentageSum = 0;
        
        this.employees.forEach((data, index) =>{
            if(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeName'].value){
                percentageSum = percentageSum + parseFloat(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeShare'].value)
            }
        })
        
        if(percentageSum == 100 && this.serviceOrderForm.valid){
            this.enableOkButton = true;
        }else{
            this.enableOkButton = false;
        }
        
        console.log(this.enableOkButton);
    }
    // --------------------------------------------------------------------------------
    
    ngOnInit() {
        var self = this;
        this.self = this;
        
        setTimeout(() => {
            this.spinnerText = "Carregando Ordens de Serviço ...";
            this.spinner.show();
        }, 0)
        
        // PREENCHE VETOR DE ORDENS DE SERVIÇO ----------------------------------------------------
        this.appService.postSearchAllServiceOrders().subscribe(function(data){
            self.serviceOrders = data;
            self.spinner.hide();
        });
        // ----------------------------------------------------------------------------------------
        
        // PREENCHE VETOR DE FUNCIONÁRIOS E ORGANIZA CHECKBOX -------------------------------------
        this.appService.postSearchAllEmployees().subscribe((data) => {
            data.forEach((v) =>{
                if(v['funcao_funcao'] == 'Acabador' || v['funcao_funcao'] == 'Acabador Fixo' || v['funcao_funcao'] == 'Ajudante Geral' || v['funcao_funcao'] == 'Serrador'){
                    var employ = {} as Employee;
                    employ.id = v['id'];
                    employ.name = v['nome'];
                    employ.function = v['funcao_funcao'];
                    self.employees.push(employ);
                    console.log(employ);
                }
            })
            
            this.employeesForm = this.formBuilder.array([]);
            this.buildEmployeesForm();

            this.serviceOrderForm = this.formBuilder.group({
                txtDate: this.formBuilder.control('',[Validators.required]),
                cbEmployees: this.employeesForm,
                cbStone: this.formBuilder.control(false),
                stoneValue: this.formBuilder.control(0)
            })
            this.releaseModal = true;
            this.serviceOrderForm.get('cbStone').valueChanges.subscribe(function(value){
                self.serviceOrderForm.get('stoneValue').setValue(parseFloat(self.selectedServiceOrder['valorComDesconto'])*0.4);
                self.showStoneValueInput = value;
            });
            
            this.serviceOrderForm.get('cbEmployees').valueChanges.subscribe(function(value){
                self.selectedEmployees = [];
                value.forEach((v, index) =>{
                    self.showInputs[index] = v['employeeName'];
                    if(v['employeeName']){
                        self.selectedEmployees.push({id: self.employees[index].id, name: self.employees[index].name, function: self.employees[index].function});
                    }
                })
                console.log(value);
                self.validateForm();
            })
            
            this.serviceOrderForm.get('txtDate').valueChanges.subscribe(function(value){
                self.validateForm();
            })
        });
        // ----------------------------------------------------------------------------------------
        
        
    }
    
}
