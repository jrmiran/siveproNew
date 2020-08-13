import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {ExecutionServiceOrder} from './execution-service-order.model';
import {Employee} from './employee.model';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReportData} from './report-data.model';
import {EmployeeAward} from './employee-award.model';

@Component({
  selector: 'sivp-service-order-report-v2',
  templateUrl: './service-order-report-v2.component.html',
  styleUrls: ['./service-order-report-v2.component.css']
})
export class ServiceOrderReportV2Component implements OnInit {

    constructor(public appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }
    
    // PARAMS ------------
    serviceOrders: Object[] = [];
    executions: ExecutionServiceOrder[] = [];
    // -------------------
    
    //VARIABLES ----------
    main: any;
    filteredExecutions: ExecutionServiceOrder[] = [];
    employees: Employee[] = [];
    reportForm: FormGroup;
    spinnerText: string = 'Aguarde ...';
    startDate = new Date();
    endDate = new Date();
    reportData = {} as ReportData;
    employeeAwards: EmployeeAward[] = [];
    functionsToCalculate: string[] = ['Acabador', 'Acabador Fixo', 'Ajudante Geral', 'Serrador'];
    // -------------------
    
    // FUNÇÃO QUE FILTRA AS EXECUÇÕES -------------------------------
    filterExecutions(){
        this.filteredExecutions = this.executions.filter((v) =>{
            return v.endDate >= this.startDate && v.endDate <= this.endDate;
        })
        this.assignReportData();
    }
    // --------------------------------------------------------------
    
    // FUNÇÃO QUE CALCULA OS VALORES DO RELATÓRIO -------------------
    assignReportData(){
        this.initializeReportData();
        this.filteredExecutions.forEach((data) =>{
            this.reportData.totalProduction = this.appService.toFixed2(this.reportData.totalProduction + data.executionValue);
            this.reportData.stoneCost = this.appService.toFixed2(this.reportData.stoneCost + data.stoneValue);
            this.reportData.empreitaProduction = data.empreita ? this.reportData.empreitaProduction + data.executionValue : this.reportData.empreitaProduction;
            this.reportData.empreitaPayment = this.reportData.empreitaPayment + data.empreitaValue;
        })
        this.reportData.totalGoal = this.reportData.totalProduction - this.reportData.stoneCost - this.reportData.empreitaPayment;
        this.reportData.totalAward = this.reportData.totalGoal - this.reportData.empreitaProduction;
        this.reportData.awardValue = this.reportData.totalAward * 0.03;
        this.reportData.salesManagerAward = this.reportData.totalGoal * 0.025;
        this.reportData.productionManagerAward = this.reportData.totalGoal * 0.01;
        this.reportData.finishingValue = this.reportData.awardValue * 0.54;
        this.reportData.supportValue = this.reportData.awardValue * 0.33;
        this.reportData.supportValue = this.reportData.awardValue * 0.13;
        this.fillEmployeeAwardsTable();
    }
    // --------------------------------------------------------------
    
    // FUNÇÃO QUE CALCULA E PREENCHE TABELA DE PREMIAÇÕES -----------
    fillEmployeeAwardsTable(){
        this.employeeAwards = [];
        
        this.employees.forEach((data) =>{
            if(this.functionsToCalculate.indexOf(data.function) >= 0){
                let employeeAward = {} as EmployeeAward;
                employeeAward.employeeId = data.id;
                employeeAward.employeeName = data.name;
                employeeAward.employeeFunction = data.function;
                // --------------------------------------------
                employeeAward.normalProduction = 0;
                employeeAward.empreitaProduction = 0;
                employeeAward.payedEmpreita = 0;
                // --------------------------------------------
                employeeAward.personalPercentage = 0;
                employeeAward.productionPercentage = 0;
                // --------------------------------------------
                employeeAward.awardValue = 0;
                // --------------------------------------------
                employeeAward.executions = this.filteredExecutions.filter((v)=>{return v.employeeId == data.id});
                this.employeeAwards.push(employeeAward);
            }
        })
        
        this.employeeAwards.forEach((data) =>{
            data.executions.forEach((v) =>{
                data.normalProduction = v.empreita ? data.normalProduction : data.normalProduction + v.executionValue - v.stoneValue;
                data.empreitaProduction = v.empreita? data.empreitaProduction + v.executionValue : data.empreitaProduction;
                data.payedEmpreita = data.payedEmpreita + v.empreitaValue;
            })
            data.personalPercentage = data.normalProduction / 20000;
            data.productionPercentage = data.normalProduction / this.reportData.totalProduction;
            if(data.employeeFunction == 'Acabador Fixo'){
                //data.awardValue = this.appService.toFixed2(this.reportData.finishingValue * data.personalPercentage);
                data.awardValue = this.appService.toFixed2(250 * data.personalPercentage);
            } else if(data.employeeFunction == 'Acabador' || data.employeeFunction == 'Serrador'){
                //data.awardValue = this.appService.toFixed2(this.reportData.supportValue / 3);
                //data.awardValue = this.appService.toFixed2((this.reportData.totalGoal / 80000) * 250) + this.appService.toFixed2(250 * data.personalPercentage);
                data.awardValue = this.appService.toFixed2((this.reportData.totalGoal / 80000) * 250);
            }else if(data.employeeFunction == 'Ajudante Geral'){
                //data.awardValue = this.appService.toFixed2(this.reportData.auxiliaryValue / 2);
                //data.awardValue = this.appService.toFixed2((this.reportData.totalGoal / 80000) * 200) + this.appService.toFixed2(200 * data.personalPercentage);
                data.awardValue = this.appService.toFixed2((this.reportData.totalGoal / 80000) * 200);
            }
        })
    }
    // --------------------------------------------------------------
    
    // FUNÇÃO QUE INICIALIZA E RESETA VALORES DO RELATÓRIO ----------
    initializeReportData(){
        this.reportData.auxiliaryValue = 0;
        this.reportData.awardValue = 0;
        this.reportData.empreitaPayment = 0;
        this.reportData.empreitaProduction = 0;
        this.reportData.finishingValue = 0;
        this.reportData.productionManagerAward = 0;
        this.reportData.salesManagerAward = 0;
        this.reportData.stoneCost = 0;
        this.reportData.supportValue = 0;
        this.reportData.totalAward = 0;
        this.reportData.totalGoal = 0;
        this.reportData.totalProduction = 0;
    }
    // --------------------------------------------------------------
    ngOnInit() {
        var self = this;
        this.main = this;
        this.spinnerText = "Carregando execuções de ordens de serviço ...";
        this.spinner.show();
        // PREENCHE VETOR DE EXECUÇÃO DE ORDENS DE SERVIÇO -----------------
        this.appService.postSearchAllExecutionServiceOrder().subscribe((data) =>{
            data.map((v) =>{
                let endDate = v['dataTermino'].split('/');
                let startDate = v['dataInicio'].split('/');
                let exec = {} as ExecutionServiceOrder;
                exec.id = v['id'];
                exec.employeeId = v['funcionario_id'];
                exec.empreita = v['empreita']['data'][0] == 0 ? false : true;
                exec.empreitaValue = parseFloat(v['valorEmpreita']);
                exec.endDate = new Date(parseFloat(endDate[2]), parseFloat(endDate[1]) - 1, parseFloat(endDate[0]));
                exec.startDate = new Date(parseFloat(startDate[2]), parseFloat(startDate[1]) - 1, parseFloat(startDate[0]));
                exec.percentage = parseFloat(v['porcentagem']);
                exec.serviceOrderId = v['ordemDeServico_id'];
                exec.stone = v['pedra'] == 0 ? false: true;
                exec.stoneValue = parseFloat(v['valorPedra']);
                exec.executionValue = parseFloat(v['valorExecucao']);
                this.executions.push(exec);
            })
            this.spinner.hide();
        })
        // -----------------------------------------------------------------
        // PREENCHE VETOR DE EXECUÇÃO DE FUNCIONÁRIOS ----------------------
        this.appService.postSearchAllEmployees().subscribe((data) =>{
            data.map((v) =>{
                let e = {} as Employee;
                e.id = v['id'];
                e.name = v['nome'];
                e.function = v['funcao_funcao'];
                this.employees.push(e);
            })
        });
        // -----------------------------------------------------------------
        
        // PREENCHIMENTO DE FORM -------------------------------------------
        this.reportForm = this.formBuilder.group({
           txtDate: this.formBuilder.control('',[])
        });
        
        this.reportForm.get('txtDate').valueChanges.subscribe((v)=>{
            this.startDate = v['startDate']['_d'];
            this.endDate = v['endDate']['_d'];
            this.filterExecutions();
        })
        // -----------------------------------------------------------------
        
        // INICIALIZA VALORES DO RELATÓRIO ---------------------------------
        this.initializeReportData();
        // -----------------------------------------------------------------
    }
}