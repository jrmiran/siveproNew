import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {DatePickerComponent} from '../shared/date-picker/date-picker.component';
import {RadioOption} from '../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import {ServiceOrderExecution} from './service-order-execution.model';
import {EmployeeExecution} from './employee-execution.model';
import {ServiceOrderAward} from './service-order-award.model';
import {AwardTable} from './award-table.model';

@Component({
  selector: 'sivp-service-order-report',
  templateUrl: './service-order-report.component.html',
  styleUrls: ['./service-order-report.component.css']
})
export class ServiceOrderReportComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private appService: AppService, private spinner: NgxSpinnerService) { }
    /*************** START VARIABLES ***************/
    userName: string;
    privilege: boolean = false;
    administrator: boolean = false;
    
    filterForm: FormGroup;
    employees: string[] = [];
    employeesFunctions: string[] = [];
    serviceOrders: Object[] = [];
    executions: ServiceOrderExecution[] = [];
    filteredExecutions: ServiceOrderExecution[] = [];
    employeeExecs: EmployeeExecution[] = [];
    employeeExecsFiltered: EmployeeExecution[] = [];
    main: any;
    functions: string[] = [];
    release: boolean = false;
    selectedFunctions: string[] = [];
    serviceOrderAward = {} as ServiceOrderAward;
    awardTable: AwardTable[] = [];
    
    startDateFilter: Date;
    endDateFilter: Date;
    cbo: FormArray;
    
    goal = 20000;
    amountSo = 0;
    amountStoneValue = 0;
    amountEmpreitaValue = 0;
    amountEmpreitaProduction = 0;
    goalAmount = 0;
    awardAmount = 0;
    award = 0;
    /*************** END VARIABLES ****************/
    
    /************ START FUNCTIONS ******************/
    clearDateFilter(){
        this.filterForm.get('txtDate').setValue('');    
    }
    
    fillServiceOrderExecution(){
        var self = this;
        this.serviceOrders.forEach(function(data){
            var empreitaValue: number;
            var stoneValue: number;
            var normalProduction: any;
            var empreitaProduction: any;
            
            // ----------------------- Verifica o valor de empreita e de pedra no banco de dados, se for nulo ou vazio, o valor é ZERO ----------------------------------
            if(data['empreita'] == null || data['empreita'] == ""){
                empreitaValue = 0;
                
            } else{
                empreitaValue = parseFloat(parseFloat(data['empreita'].replace(',','.')).toFixed(2));
                
            }
            if(data['pedra'] == null || data['pedra'] == ""){
                stoneValue = 0;
            } else{
                stoneValue = parseFloat(parseFloat(data['pedra'].replace(',','.')).toFixed(2))
            }
            // ----------------------- Verifica o valor de empreita e de pedra no banco de dados, se for nulo ou vazio, o valor é ZERO ----------------------------------
            
            if(empreitaValue == 0){
                empreitaProduction = "0";
                normalProduction = data['valor'];
            }else{
                empreitaProduction = data['valor'];
                normalProduction = "0";
            }
            
            var exec = {} as ServiceOrderExecution;
            exec.so = parseFloat(data['os']);
            exec.employee = data['funcionario'];
            exec.date = data['dataTermino'];
            exec.percentage = parseFloat(parseFloat(data['porcentagem']).toFixed(2));
            exec.valueSo = parseFloat(parseFloat(data['valor'].replace(',','.')).toFixed(2));
            exec.valueExecution = parseFloat((parseFloat(normalProduction.replace(',','.')) * parseFloat(data['porcentagem']) / 100).toFixed(2));
            exec.empreita = parseFloat((empreitaValue * parseFloat(data['porcentagem']) / 100).toFixed(2));
            exec.stone = parseFloat((stoneValue * parseFloat(data['porcentagem']) / 100).toFixed(2));
            exec.empreitaProduction = parseFloat((parseFloat(empreitaProduction.replace(',','.')) * parseFloat(data['porcentagem']) / 100).toFixed(2));
            exec.function = data['funcao'];
            self.executions.push(exec);
            
        });
        console.log(self.executions);
        this.spinner.hide();
        
    }
    
    applyFilter(){
        var self = this;
        this.amountSo = 0;
        this.amountStoneValue = 0;
        this.amountEmpreitaValue = 0;
        this.amountEmpreitaProduction = 0;
        this.goalAmount = 0;
        this.awardAmount = 0;
        this.award = 0;
        
        
        this.filteredExecutions = [];
        
        this.filteredExecutions = this.executions.filter((data) =>{
            return self.filterDataDate(data, 'date', self.startDateFilter, self.endDateFilter);
        });
        
        this.filteredExecutions.forEach(function(data){
            self.amountSo = parseFloat((self.amountSo + data['valueExecution']).toFixed(2));
            self.amountStoneValue = parseFloat((self.amountStoneValue + data['stone']).toFixed(2));
            self.amountEmpreitaValue = parseFloat((self.amountEmpreitaValue + data['empreita']).toFixed(2));
            self.amountEmpreitaProduction = parseFloat((self.amountEmpreitaProduction + data['empreitaProduction']).toFixed(2));
        });
        
        self.amountSo = parseFloat((self.amountSo + self.amountEmpreitaProduction).toFixed(2));
        self.goalAmount = parseFloat((self.amountSo - self.amountEmpreitaValue - self.amountStoneValue).toFixed(2));
        self.awardAmount = parseFloat((self.goalAmount - self.amountEmpreitaProduction).toFixed(2));
        self.award = parseFloat((self.awardAmount*0.03).toFixed(2));
        
        self.serviceOrderAward.salesManager = parseFloat((self.goalAmount * 0.025).toFixed(2));
        self.serviceOrderAward.productionManager = parseFloat((self.goalAmount * 0.01).toFixed(2));
        self.serviceOrderAward.finishing = parseFloat((self.award * 0.54).toFixed(2));
        self.serviceOrderAward.suport = parseFloat((self.award * 0.33).toFixed(2));
        self.serviceOrderAward.auxiliary = parseFloat((self.award * 0.13).toFixed(2));
        
        console.log(this.filteredExecutions);
        
        console.log(self.amountSo);
        console.log(self.amountStoneValue);
        console.log(self.amountEmpreitaValue);
        console.log(self.amountEmpreitaProduction);
        
        
        
        this.fillEmployeeExecution();
    }
    
    fillEmployeeExecution(){
        var self = this;
        
        this.employeeExecs = [];
        this.employees.forEach(function(data, index){
            var eExec = {} as EmployeeExecution;
            var exec = {} as ServiceOrderExecution[];
            var normalProduction = 0;
            var execValue = 0;
            var stoneValue = 0;
            var empreitaValue = 0;
            var empreitaProduction = 0;
            
            exec = self.filteredExecutions.filter((v) =>{
               return v.employee == data;
            });
            
            exec.forEach(function(value){
                stoneValue = stoneValue + value.stone;
                empreitaValue = empreitaValue + value.empreita;
                normalProduction = normalProduction + value.valueExecution;
                execValue = execValue + value.valueExecution;
                empreitaProduction = empreitaProduction + value.empreitaProduction;
            });

            eExec.employee = data;
            eExec.qtdSo = exec.length;
            eExec.normalProduction = self.appService.converteFloatMoeda(parseFloat(normalProduction.toFixed(2)));
            eExec.percentagePersonal = (((execValue / self.goal)*100).toFixed(2)).replace('.',',') + "%";
            eExec.percentageTotal = (((execValue / self.amountSo) * 100).toFixed(2)).replace('.',',') + "%";
            eExec.empreitaPayed = self.appService.converteFloatMoeda(parseFloat(empreitaValue.toFixed(2)));
            eExec.stone = self.appService.converteFloatMoeda(parseFloat(stoneValue.toFixed(2)));
            eExec.empreitaProduction = self.appService.converteFloatMoeda(parseFloat(empreitaProduction.toFixed(2)));
            eExec.function = self.employeesFunctions[index];
            
            self.employeeExecs.push(eExec);
        });
        self.employeeExecsFiltered = self.employeeExecs;
        this.checkStatusFunction();
        self.fillAwardTable();
        console.log(self.employeeExecs);
    }
    
    filterDataDate(data: any, param: string, startDate: any, endDate: any){
        let date = data['date'].split('/');
        var auxDate: Date = new Date(date[2], date[1]-1, date[0]);
        
        if(!startDate || !endDate){
            return true;
        }else{
            return auxDate >= startDate && auxDate <= endDate;
        }
    }
    
    buildFunctions(){
        var values: FormControl[] = [];
        
        this.functions.forEach(function(data){
            if(data != 'Acabador Fixo'){
                values.push(new FormControl(false));
            }else{
                values.push(new FormControl(true));
            }
        })
        //const values = this.functions.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    buildSelectedFunctions(){
        const values = this.functions.map(v => new FormControl(true));
        return this.formBuilder.array(values); 
    }
    
    filterByFunction(i: number){
        var self = this;
        
        // LIST OF FUNCTIONS SELECTED IN CHECKBOX
        this.selectedFunctions = [];
        
        // TOGLE CHECKBOX
        this.filterForm.value.cbFunctions[i] = !this.filterForm.value.cbFunctions[i];
        
        // FILL THE LIST OF SELECTED FUNCTIONS
        this.filterForm.value.cbFunctions.forEach(function(data, index){
            if(data){
                self.selectedFunctions.push(self.functions[index]);
            }
        });
        
        // FILTER THE EXECUTION LIST BY SELECTED FUNCTIONS
        self.filteredExecutions = self.filteredExecutions.filter((data) =>{
                return self.selectedFunctions.indexOf(data['function']) > -1;
        });
        
        // FILTER THE EXECUTION LIST BY SELECTED FUNCTIONS
        self.employeeExecsFiltered = self.employeeExecs.filter((data) =>{
                return self.selectedFunctions.indexOf(data['function']) > -1;
        });
        
        console.log(self.employeeExecs);
    }
    
    checkAll(){
        var self = this;
        
        if(this.filterForm.controls.cbFunctions.value.indexOf(true) > -1){
            this.filterForm.get('cbFunctions').patchValue(Array(this.functions.length).fill(false), { emitEvent: false });
            this.filterForm.value.cbFunctions.map((v) => {v = false});
        } else{
            this.filterForm.get('cbFunctions').patchValue(Array(this.functions.length).fill(true), { emitEvent: false });
            this.filterForm.value.cbFunctions.map((v) => {v = true});
        }
        this.checkStatusFunction();
        console.log(this.filterForm.controls.cbFunctions.value);
    }
    
    checkStatusFunction(){
        var self = this;
        // FILL THE LIST OF SELECTED FUNCTIONS
        this.filterForm.value.cbFunctions.forEach(function(data, index){
            if(data){
                self.selectedFunctions.push(self.functions[index]);
            }
        });
        
        // FILTER THE EXECUTION LIST BY SELECTED FUNCTIONS
        self.filteredExecutions = self.filteredExecutions.filter((data) =>{
                return self.selectedFunctions.indexOf(data['function']) > -1;
        });
        
        // FILTER THE EXECUTION LIST BY SELECTED FUNCTIONS
        self.employeeExecsFiltered = self.employeeExecs.filter((data) =>{
                return self.selectedFunctions.indexOf(data['function']) > -1;
        });
        
        console.log(self.employeeExecs);
    }
    
    fillAwardTable(){
        var self = this;
        self.awardTable = []; 
        this.employees.forEach(function(data, index){
            var aTable = {} as AwardTable;
            if(self.employeesFunctions[index] == 'Gerente de Vendas'){
                aTable.employee = data;
                aTable.function = self.employeesFunctions[index];
                aTable.percentagePersonal = "-";
                aTable.percentageTotal = "-";
                aTable.empreitaPayed = "-";
                aTable.awardValue = self.appService.converteFloatMoeda(parseFloat(self.serviceOrderAward.salesManager.toFixed(2)));
                self.awardTable.push(aTable);
            } else if(self.employeesFunctions[index] == 'Gerente de Produção'){
                aTable.employee = data;
                aTable.function = self.employeesFunctions[index];
                aTable.percentagePersonal = "-";
                aTable.percentageTotal = "-";
                aTable.empreitaPayed = "-";
                aTable.awardValue = self.appService.converteFloatMoeda(parseFloat(self.serviceOrderAward.productionManager.toFixed(2)));
                self.awardTable.push(aTable); 
            }else if(self.employeesFunctions[index] == 'Acabador Fixo'){
                aTable.employee = data;
                aTable.function = self.employeesFunctions[index];
                aTable.percentagePersonal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentagePersonal'];
                aTable.percentageTotal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentageTotal'];
                aTable.empreitaPayed = self.employeeExecs.find((v) => {return v['employee'] == data})['empreitaPayed'];
                aTable.awardValue = self.appService.converteFloatMoeda(parseFloat((self.serviceOrderAward.finishing * parseFloat(self.employeeExecs.find((v) => {return v['employee'] == data})['percentageTotal'].replace(',','.').replace('%','')) / 100).toFixed(2)));
                self.awardTable.push(aTable); 
            }else if(self.employeesFunctions[index] == 'Serrador' || self.employeesFunctions[index] == 'Acabador'){
                aTable.employee = data;
                aTable.function = self.employeesFunctions[index];
                aTable.percentagePersonal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentagePersonal'];
                aTable.percentageTotal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentageTotal'];
                aTable.empreitaPayed = self.employeeExecs.find((v) => {return v['employee'] == data})['empreitaPayed'];
                aTable.awardValue = self.appService.converteFloatMoeda(parseFloat(self.serviceOrderAward.suport.toFixed(2)));
                self.awardTable.push(aTable); 
            }else if(self.employeesFunctions[index] == 'Ajudante Geral'){
                aTable.employee = data;
                aTable.function = self.employeesFunctions[index];
                aTable.percentagePersonal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentagePersonal'];
                aTable.percentageTotal = self.employeeExecs.find((v) => {return v['employee'] == data})['percentageTotal'];
                aTable.empreitaPayed = self.employeeExecs.find((v) => {return v['employee'] == data})['empreitaPayed'];
                aTable.awardValue = self.appService.converteFloatMoeda(parseFloat(self.serviceOrderAward.auxiliary.toFixed(2)));
                self.awardTable.push(aTable); 
            }
        })
        
        self.awardTable.sort(function (a, b) {
            if (a.function > b.function) {
                return 1;
            }
            if (a.function < b.function) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
    }
    /************ END FUNCTIONS ******************/
    
    
    ngOnInit() {
        var self = this;
        this.main = this;
        
        this.spinner.show();
        
        this.userName = window.sessionStorage.getItem('user');  
        if(window.sessionStorage.getItem('administrator') == "1"){
            this.administrator = true;
            console.log(this.administrator);
        }
        if(window.sessionStorage.getItem('privilege') == "1"){
            this.privilege = true;
            console.log(this.privilege);
        }
        
        
        self.filterForm = self.formBuilder.group({
                txtDate: self.formBuilder.control('', []),
                cbFunctions: self.buildFunctions()
            });
        
        /*PREENCHE VETOR DE FUNCIONÁRIOS E FUNÇÕES*/
        this.appService.postSearchAllEmployees().subscribe(function(data){
            console.log(data);
            var employeeAux: Object[] = [];
            employeeAux = data.filter(function(value){return value['funcao_funcao'] == "Acabador Fixo";});
            
            data.forEach(function(value){
                self.employees.push(value['nome']);
                self.employeesFunctions.push(value['funcao_funcao']);
                if(self.functions.indexOf(value['funcao_funcao']) < 0){
                    self.functions.push(value['funcao_funcao']);
                }
            })
            
            self.filterForm.controls.cbFunctions = self.buildFunctions();

            // LISTA DE FUNÇÕES
            self.cbo = (self.filterForm.get('cbFunctions') as FormArray);
            self.appService.postServiceOrderByEmployee().subscribe(function(value){
                self.serviceOrders = value;
                self.fillServiceOrderExecution();
                self.release = true;
            });
        });
        /*PREENCHE VETOR DE FUNCIONÁRIOS E FUNÇÕES*/
        
        this.filterForm.get('txtDate').valueChanges.subscribe(function(data){
            
        if(data['startDate'] == null){
            self.startDateFilter = undefined;
            self.endDateFilter = undefined;
        } else{
        
            var startDate = data['startDate']['_d'];
            var endDate = data['endDate']['_d'];
            var datePipe = new DatePipe('en-US');
            
            var startDateAux = datePipe.transform(startDate, 'dd/MM/yyyy');
            var endDateAux = datePipe.transform(endDate, 'dd/MM/yyyy');

            var startDateAux2 = startDateAux.split('/');
            var endDateAux2 = endDateAux.split('/');
            
            self.startDateFilter = new Date(parseFloat(startDateAux2[2]), parseFloat(startDateAux2[1])-1, parseFloat(startDateAux2[0]));
            self.endDateFilter = new Date(parseFloat(endDateAux2[2]), parseFloat(endDateAux2[1])-1, parseFloat(endDateAux2[0]));
            
            console.log(self.startDateFilter);
            console.log(self.endDateFilter);
            
            self.applyFilter();
        }
    });
    }
}