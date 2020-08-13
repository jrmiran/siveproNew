import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ExecutionServiceOrder} from '../service-order-execution-v2.model';
import {Employee} from '../employee.model';
import { DatePipe } from '@angular/common';
import {DatePickerComponent} from '../../shared/date-picker/date-picker.component';

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
    initialExecutions: ExecutionServiceOrder[] = [];
    filteredExecutions: ExecutionServiceOrder[] = [];
    filteredServiceOrders: any = [];
    datePipe = new DatePipe('en-US');
    startDateFilter: Date;
    endDateFilter: Date;
    executionTitle: string = '';
     @ViewChild('dPicker') dPicker: DatePickerComponent;
    // -----------------------
    
    // FORM VARIABLES ----------------
    serviceOrderForm: FormGroup;
    employeesForm: FormArray;
    percentagesForm: FormArray;
    empreitasForm: FormArray;
    filterForm: FormGroup;
    // -------------------------------
    releaseEmployeesSelection: boolean = false;
    employeesList = [];
    selectedItems = [];

    dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Selecionar Tudo',
      unSelectAllText: 'Remover Seleção',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    
    selectedEmployeeId: number[] = [];
    
    onItemSelect(item: any) {}
    onSelectAll(items: any) {}

    // FUNÇÃO QUE ABRE O MODAL PARA ALTERAR SO CHAMADA PELA TABLE ---------------------
    openModalChangeSO(id){
        this.selectedSO = id;
        document.getElementById('openModalButton').click();
        this.serviceOrderForm.get('cbEmployees')['controls'].forEach((v, index)=>{
            if(v['value']['employeeName']){
                document.getElementById(this.idsInput[index]).click();
            }
        })
        if(this.serviceOrderForm.get('cbStone').value){
            document.getElementById('cbStone').click();
        }
        this.dPicker.clearField();
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
        this.spinner.show();
        this.executions = [];
        var removeExecutions: number[] = [];
        
        this.initialExecutions.filter((v)=>{
            return v.serviceOrderId == this.selectedServiceOrder['id'];
        }).forEach((data)=>{
            removeExecutions.push(data['id']);
        })
        
        var stoneValue = this.appService.toFixed2(parseFloat(this.serviceOrderForm.get('stoneValue').value));
        this.employees.forEach((data, index) =>{
            if(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeName'].value){
                var exec = {} as ExecutionServiceOrder;
                exec.employeeId = data.id;
                exec.employeeShare = parseFloat(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeShare'].value);
                exec.empreitaValue = parseFloat(this.serviceOrderForm.get('cbEmployees')['controls'][index].controls['employeeEmpreita'].value);
                exec.empreita = exec.empreitaValue > 0 ? 1 : 0;
                exec.endDate = this.serviceOrderForm.get('txtDate').value;
                exec.stoneValue = stoneValue * (exec.employeeShare / 100);
                exec.stone = exec.stoneValue > 0 ? 1 : 0;
                exec.empreitaPaymentDate = '';
                exec.serviceOrderId = this.selectedServiceOrder['id'];
                exec.startDate = '';
                exec.employeeName = data.name;
                exec.serviceOrderValue = parseFloat(this.selectedServiceOrder['valorComDesconto']);
                exec.executionValue = (exec.serviceOrderValue*exec.employeeShare/100) - exec.stoneValue - exec.empreitaValue;
                this.executions.push(exec);
                this.serviceOrders.find((os)=>{return os['id'] == exec.serviceOrderId})['executado'] = true;
            }
        })
        
        this.appService.postInsertExecutionServiceOrder({execution: this.executions, removeExecutions: removeExecutions}).subscribe((data) =>{
            var d;
            if(data.length > 0){
                d = data[0];
            }else{
                d = data;
            }
            this.executions.forEach((v, index)=>{
                v.id = d['insertId'] + index;
            })
            
            this.initialExecutions = this.initialExecutions.filter((ex)=>{
                return ex.serviceOrderId != this.selectedServiceOrder['id'];
            });
            this.initialExecutions = this.initialExecutions.concat(this.executions);
            alert("Ordem de serviço lançada!");
            this.spinner.hide();
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
    
    // FUNÇÃO QUE MOSTRA AS EXECUÇÕES DA ORDEM DE SERVIÇO
    showExecutions(index: any, data: any){
        this.filteredExecutions = this.initialExecutions.filter((v)=>{
            return v.serviceOrderId == data['id']; 
        })
        var so = this.serviceOrders.find((so)=>{
            return so['id'] == data['id']
        })
        this.executionTitle = "Execução OS " + so['id'] + "\nValor: " + this.appService.converteFloatMoeda(so['valorComDesconto']);
        document.getElementById('openModalExecution').click();
        
    }
    // ---------------------------------------------------------------------------------
    
    // FUNÇÃO QUE FAZ FILTRO PARA EXIBIÇÃO DAS ORDENS DE SERVIÇO -----------------------
    filterServiceOrders(){
        var filteredExecutions: ExecutionServiceOrder[] = [];
        var osIds: number[] = [];
        filteredExecutions = this.initialExecutions.filter((v)=>{
            return v['endDate'] >= this.startDateFilter && v['endDate'] <= this.endDateFilter && this.selectedEmployeeId.indexOf(v['employeeId']) >= 0;
            //return  this.selectedEmployeeId.indexOf(v['employeeId']) >= 0;
        })
        filteredExecutions.forEach((v)=>{
            osIds.push(v['serviceOrderId']);
        })
        this.filteredServiceOrders = this.serviceOrders.filter((v)=>{
            return osIds.indexOf(v['id']) >= 0;
        })
    }
    // --------------------------------------------------------------------------------

    ngOnInit() {
        var self = this;
        this.self = this;
        
        setTimeout(() => {
            this.spinnerText = "Carregando Ordens de Serviço ...";
            this.spinner.show();
        }, 0)
        
        this.filterForm = this.formBuilder.group({
                txtDate: this.formBuilder.control('',[Validators.required]),
                cbEmployees: this.formBuilder.control('')
            })
            this.filterForm.get('cbEmployees').valueChanges.subscribe((v)=>{
                this.selectedEmployeeId = [];
                v.forEach((e)=>{
                    this.selectedEmployeeId.push(e['item_id']);
                })
                console.log(this.selectedEmployeeId);
            })
            this.filterForm.get('txtDate').valueChanges.subscribe((v)=>{
                this.startDateFilter = v['startDate']['_d'];
                this.endDateFilter = v['endDate']['_d'];
            })
        
        // PREENCHE VETOR DE ORDENS DE SERVIÇO ----------------------------------------------------
        this.appService.postSearchAllServiceOrders().subscribe(function(data){
            console.log(data);
            self.serviceOrders = data[0];
            self.filteredServiceOrders = data[0];
            var execs = data[1] as Object[];
            execs.forEach((v)=>{
                var e = {} as ExecutionServiceOrder; 
                e.id = v['id'];
                e.employeeId = v['funcionario_id'];
                e.employeeShare = v['porcentagem'];
                e.empreitaValue = parseFloat(v['valorEmpreita']);
                e.stoneValue = parseFloat(v['valorPedra']);
                e.serviceOrderId = v['ordemDeServico_id'];
                e.startDate = v['dataInicio'];
                e.empreita = v['empreita'];
                e.stone = v['pedra'];
                e.empreitaPaymentDate = v['dataPagamentoEmpreita'];
                e.employeeName = v['nome'];
                e.serviceOrderValue = parseFloat(self.serviceOrders.find((so)=>{
                  return so['id'] == e.serviceOrderId;  
                })['valorComDesconto'])
                e.executionValue = (e.serviceOrderValue * e.employeeShare / 100) - e.stoneValue - e.empreitaValue;
                self.initialExecutions.push(e);
                
                var auxDate = v['dataTermino'].split('/');
                e.endDate = new Date(parseFloat(auxDate[2]), parseFloat(auxDate[1])-1, parseFloat(auxDate[0]));

            });
            console.log(self.initialExecutions);
            self.spinner.hide();
        });
        // ----------------------------------------------------------------------------------------
        
        // PREENCHE VETOR DE FUNCIONÁRIOS E ORGANIZA CHECKBOX -------------------------------------
        this.appService.postSearchAllEmployees().subscribe((data) => {
            data.forEach((v, index) =>{
                if(v['funcao_funcao'] == 'Acabador' || v['funcao_funcao'] == 'Acabador Fixo' || v['funcao_funcao'] == 'Ajudante Geral' || v['funcao_funcao'] == 'Serrador'){
                    var employ = {} as Employee;
                    employ.id = v['id'];
                    employ.name = v['nome'];
                    employ.function = v['funcao_funcao'];
                    self.employees.push(employ);
                    self.employeesList.push({ item_id: v['id'], item_text: v['nome'] });
                }
            })
            this.releaseEmployeesSelection = true;
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
                if(value){
                    self.serviceOrderForm.get('stoneValue').setValue(parseFloat(self.selectedServiceOrder['valorComDesconto'])*0.4);
                } else{
                    self.serviceOrderForm.get('stoneValue').setValue(0);
                }
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