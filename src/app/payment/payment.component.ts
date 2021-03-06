import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {Payment} from './payment.model';
import {DatePickerComponent} from '../shared/date-picker/date-picker.component';
import {RadioOption} from '../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentReportService } from './payment-report.service';
import {PaymentByType} from './payment-by-type.model';

@Component({
  selector: 'sivp-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private paymentReportService: PaymentReportService) { }
    
    payments: Object[] = [];
    filteredPayments: Object[] = [];
    self: any = this;
    paymentForm: FormGroup;
    paymentFormEdit: FormGroup;
    paymentTypeForm: FormGroup;
    paymentFormForm: FormGroup;
    generalReportForm: FormGroup;
    filterForm: FormGroup;
    status: string[] = ['', 'Pago', 'Não Pago', 'Cheque a Compensar'];
    paymentWay: string[] = ['', 'Cartão Crédito', 'Cartão Débito', 'Cheque', 'Dinheiro'];
    paymentType: string[] = ['', 'Salario', 'Investimento', 'Maquinario', 'Insumos'];
    totalParts: number = 0;
    currentPart: number = 1;
    paymentsParts: Payment[] = [];
    enableOk: boolean = false;
    paymentId: any;
    requestId = 0;
    @ViewChild('dPicker') dPicker: DatePickerComponent;
    @ViewChild('dPickerEdit') dPickerEdit: DatePickerComponent;
    inOut: RadioOption[] = [
        {label: 'Entrada', value: 'IN'},
        {label: 'Saída', value: 'OUT'}
    ]
    inOutPayment: string;
    showForm: boolean = false;
    selected: {startDate: any, endDate: any};
    startDateFilter: Date;
    endDateFilter: Date;
    totalValue: number = 0;
    totalValueString: string = "";
    months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    years = [2018,2019,2020,2021,2022,2023,2024];
    paymentCategory: string[] = [];
    reportPayments: any[] = [];
    // PIE CHART PARAMETERS ----------------------------------
    dataPieChart: number[] = [];
    labelPieChart: string[] = [];
    colors: any[] = [
      { 
        backgroundColor:["#0A1172", "#016064", "#59788E", "#022D36", "#151E3D", "#00FF00", "FF0000"] 
      }];
    // ---------------------------------------------------
    
    // BAR CHART PARAMETERS ----------------------------------
    barChartDatasets = [{data: [], label: 'Fixo', yAxisID: 'y-axis-1', backgroundColor: "#0A1172"}, 
                {data: [], label: 'Variável', yAxisID: 'y-axis-1', backgroundColor: "#016064"},
                {data: [], label: 'Pontual', yAxisID: 'y-axis-1', backgroundColor: "#59788E"},
                {data: [], label: 'Funcionário', yAxisID: 'y-axis-1', backgroundColor: "#a4adb0"},
                {data: [], label: 'Entrada', type: 'line', yAxisID: 'y-axis-2', backgroundColor: "#002E1A"},
                {data: [], label: 'Saída', type: 'line', yAxisID: 'y-axis-2', backgroundColor: "#660000"} 
               ];
    barChartOptions =  {
        responsive: true,
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              position: 'right',
              ticks: {
                beginAtZero: true
              },
                gridLines: {
                display:false
            }
            },
            {
              id: 'y-axis-2',
              position: 'left',
              ticks: {
                beginAtZero: true
              },
                gridLines: {
                display:false
            }
            }
          ]
        },
        plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
    }
    barChartLabels = [];
    // -------------------------------------------------------
    releaseGeneralReport: boolean = false;
    
    setTotalValue(){
        var self = this;
        self.totalValue = 0;
        this.filteredPayments.forEach(function(data){
            self.totalValue = self.totalValue + self.appService.converteMoedaFloat(data['valor']);
            self.totalValueString = self.appService.converteFloatMoeda(parseFloat(self.totalValue.toFixed(2)));
        });    
    }
    
    clearFilter(){
        this.clearDateFilter();
        this.filterForm.get('cmbInOut').setValue('');
        this.filterForm.get('txtBill').setValue('');
        this.filterForm.get('txtValue').setValue(null);
        this.filterForm.get('cmbStatus').setValue('');
        this.filterForm.get('cmbPaymentForm').setValue('');
        this.filterForm.get('txtCheckNumber').setValue('');
        this.filterForm.get('cmbTypePayment').setValue('');
        this.filterForm.get('txtNote').setValue('');
    }
    
    enableOkFunction(){
        if(this.currentPart == this.totalParts){
            this.enableOk = true;
        }else{
            this.enableOk = false;
        }
    }
    
    
    radioEvent(){
        if(this.paymentForm.get('rdInOut').value == "IN"){
            this.inOutPayment = "1";
        } else{
            this.inOutPayment = "0";
        }
    }
    
    applyFilter(){
        var self = this;
        
        this.filteredPayments = this.payments.filter(function(data){
            return self.filterData(data, 'formaPagamento_formaPagamento', self.filterForm.get('cmbPaymentForm').value) 
            && self.filterData(data, 'status', self.filterForm.get('cmbStatus').value)
            && self.filterData(data, 'conta', self.filterForm.get('txtBill').value, true)
            && self.filterData(data, 'numeroCheque', self.filterForm.get('txtCheckNumber').value)
            && self.filterData(data, 'tipoPagamento_tipoPagamento', self.filterForm.get('cmbTypePayment').value)
            && self.filterData(data, 'observacao', self.filterForm.get('txtNote').value, true)
            && self.filterData(data, 'entrada', self.filterForm.get('cmbInOut').value)
            && self.filterData(data, 'valor', self.appService.converteFloatMoeda(self.filterForm.get('txtValue').value))
            && self.filterData(data, 'id', self.filterForm.get('txtId').value)
            && self.filterDataDate(data, 'data', self.startDateFilter, self.endDateFilter);
        });
        self.chartGenerator();
        self.setTotalValue();
    }
    
    filterData(data: any, param:string, value: any, contains?: boolean){
        if(param == 'valor' && value == 'R$ 0,00'){
            return true;
        }
        if(param == "entrada"){
            if(value == ""){
                return true;
            }
            if(value == "Saída"){
                value = false;
            }else{
                value = true;
            }
            return data[param] == value;
        }

        if(data[param] == null){
                return true;
        }
        if(contains){
            return data[param].includes(value);
            //return true;
        }
        if(value != null && value != "" && value != "R$ n.ull,00"){
            return data[param] == value;
        } else{
            //return data[param].includes("");
            return true;
        }
    }
    
    filterDataDate(data: any, param: string, startDate: any, endDate: any){
        //let date = data['data'].split('/');
        //var auxDate: Date = new Date(date[2], date[1]-1, date[0]);
        var auxDate = data['data'];
        if(!startDate || !endDate){
            return true;
        }else{
            return auxDate >= startDate && auxDate <= endDate;
        }
    }
    
    clearDateFilter(){
        this.filterForm.get('txtDate').setValue('');    
    }
    
    closeModal(){
        this.paymentForm.get('txtInstallment').setValue("");
        this.paymentForm.get('txtDate').setValue("");
        this.paymentForm.get('txtBill').setValue("");
        this.paymentForm.get('txtValue').setValue("0");
        this.paymentForm.get('cmbStatus').setValue("");
        this.paymentForm.get('cmbPaymentForm').setValue("");
        this.paymentForm.get('txtCheckNumber').setValue("");
        this.paymentForm.get('cmbTypePayment').setValue("");
        this.paymentForm.get('txtNote').setValue("");
        this.paymentsParts = [];
        this.totalParts = 0;
        this.currentPart = 1;
        this.dPicker.clearField();
        this.showForm = false;
        this.enableOk = false;
    }
    updatePaymentForm(type: string){
        //---------------------------------------------------------  CLIQUE NO BOTÃO NEXT  ---------------------------------------------------------
        if(type=="next"){
            if(this.paymentsParts[this.currentPart].date != ""){
                let date: string[] = this.paymentsParts[this.currentPart].date.split('/');
                this.dPicker.setDate(new Date(parseFloat(date[2]), parseFloat(date[1])-1, parseFloat(date[0])));
            } else{
                this.dPicker.clearField();
                this.paymentForm.get('txtDate').setValue("");
            }
        //---------------------------------------------------  CLIQUE NO BOTÃO ANTERIOR  ------------------------------------------------------
        }else{
            if(this.paymentsParts[this.currentPart-2].date != ""){
                let date: string[] = this.paymentsParts[this.currentPart-2].date.split('/');
                this.dPicker.setDate(new Date(parseFloat(date[2]), parseFloat(date[1])-1, parseFloat(date[0])));
            } else{
                this.dPicker.clearField();
                this.paymentForm.get('txtDate').setValue("");
            }
            this.paymentForm.get('txtValue').setValue(this.paymentsParts[this.currentPart-2].value);
        this.paymentForm.get('cmbStatus').setValue(this.paymentsParts[this.currentPart-2].status);
        this.paymentForm.get('cmbPaymentForm').setValue(this.paymentsParts[this.currentPart-2].paymentForm);
        this.paymentForm.get('txtCheckNumber').setValue(this.paymentsParts[this.currentPart-2].check);
        this.paymentForm.get('cmbTypePayment').setValue(this.paymentsParts[this.currentPart-2].paymentType);
        this.paymentForm.get('txtNote').setValue(this.paymentsParts[this.currentPart-2].note);
        }
    }
    
    applyChangesPayment(){
        this.paymentsParts[this.currentPart-1].type = this.inOutPayment;
        this.paymentsParts[this.currentPart-1].date = this.paymentForm.get('txtDate').value;
        this.paymentsParts[this.currentPart-1].bill = this.paymentForm.get('txtBill').value + " - " + this.currentPart + "/" + this.totalParts;
        this.paymentsParts[this.currentPart-1].part = this.currentPart + "/" + this.totalParts;
        this.paymentsParts[this.currentPart-1].value = parseFloat(this.paymentForm.get('txtValue').value);
        this.paymentsParts[this.currentPart-1].status = this.paymentForm.get('cmbStatus').value;
        this.paymentsParts[this.currentPart-1].check = this.paymentForm.get('txtCheckNumber').value;
        this.paymentsParts[this.currentPart-1].paymentForm = this.paymentForm.get('cmbPaymentForm').value;
        this.paymentsParts[this.currentPart-1].paymentType = this.paymentForm.get('cmbTypePayment').value;
        this.paymentsParts[this.currentPart-1].note = this.paymentForm.get('txtNote').value;
        this.paymentsParts[this.currentPart-1].budgetId = this.paymentForm.get('txtBudget').value;
        
    }
    
    changePayment(type: string){
        this.applyChangesPayment();
        this.updatePaymentForm(type);
        //---------------------------------------------------------  CLIQUE NO BOTÃO NEXT  ---------------------------------------------------------
        if(type=="next"){
            if(this.currentPart < this.totalParts){
                this.currentPart = this.currentPart + 1;
            }
        //---------------------------------------------------------  CLIQUE NO BOTÃO ANTERIOR  ---------------------------------------------------------    
        }else{
            if(this.currentPart > 1){
                this.currentPart = this.currentPart - 1;
            }
        }
        this.enableOkFunction();
    }
    
    newPayment(): Payment{
        return {id: 0, type: "", date: "", bill: "", part: "", value: 0, status: "", check: "", paymentForm: "", paymentType: "", note: "", budgetId: 1, paymentCategory: ''};
    }
    
    setNewPayment(){
        this.dPicker.setDate(new Date());
    }
    
    submitPayments(){
        var self = this;
        var insertOnRequest = "";
        this.spinner.show();
        this.applyChangesPayment();
        var params = {query: this.stringQuery()};
        this.appService.postInsertPayment(params).subscribe(function(data){
            var insertId: number = data['insertId'];
            self.paymentsParts.forEach(function(value, index){
                var aux = value.date.split('/');
                var auxDate = new Date(parseFloat(aux[2]), parseFloat(aux[1])-1, parseFloat(aux[0]));
                //self.filteredPayments.push({conta: value.bill, data: auxDate, entrada: value.type, formaPagamento_formaPagamento: value.paymentForm, funcionario_id: null, id: insertId, numeroCheque: value.check, observacao: value.note, status: value.status, tipoPagamento_tipoPagamento: value.paymentType, valor: value.value, orcamento_id: value.budgetId});
                self.payments.push({conta: value.bill, data: auxDate, entrada: value.type, formaPagamento_formaPagamento: value.paymentForm, funcionario_id: null, id: insertId, numeroCheque: value.check, observacao: value.note, status: value.status, tipoPagamento_tipoPagamento: value.paymentType, valor: "R$ " + value.value.toString().replace('.',','), orcamento_id: value.budgetId});
                if(self.requestId > 0){
                    insertOnRequest = insertOnRequest + "(" + self.requestId + "," + insertId + ")";
                    if(index != self.paymentsParts.length - 1){
                        insertOnRequest = insertOnRequest + ",";
                    }
                }
                insertId = insertId + 1;
            });
            if(self.requestId > 0){
                self.appService.postInsertPaymentOnRequest({query: insertOnRequest}).subscribe(function(v){
                })
            }
            alert("Pagamentos Registrados!");
            document.getElementById('closeButton').click();
            self.spinner.hide();
            if(self.requestId  > 0){
                self.router.navigate(['request']);
            }
        })
    }
    editPayment(id: any){
        
        var paymentEdit = this.payments.find(function(data){return data['id'] == id});
        
        this.paymentId = id;
        var inOut: string = "";
        if(paymentEdit['entrada']){
            inOut = "Entrada";
        }else{
            inOut = "Saída";
        }
        
        var datePipe = new DatePipe('en-US');
        
        console.log(paymentEdit);
        console.log(paymentEdit['data']);
        console.log(this.paymentFormEdit.get('txtDateEdit').value);
        this.paymentFormEdit.get('txtDateEdit').setValue(datePipe.transform(paymentEdit['data'], 'dd/MM/yyyy'));
        this.paymentFormEdit.get('txtBillEdit').setValue(paymentEdit['conta']);
        this.paymentFormEdit.get('txtValueEdit').setValue(parseFloat(paymentEdit['valor'].substring(3).replace('.','').replace(',','.')));
        this.paymentFormEdit.get('cmbStatusEdit').setValue(paymentEdit['status']);
        this.paymentFormEdit.get('cmbPaymentFormEdit').setValue(paymentEdit['formaPagamento_formaPagamento']);
        this.paymentFormEdit.get('txtCheckNumberEdit').setValue(paymentEdit['numeroCheque']);
        this.paymentFormEdit.get('cmbTypePaymentEdit').setValue(paymentEdit['tipoPagamento_tipoPagamento']);
        this.paymentFormEdit.get('txtNoteEdit').setValue(paymentEdit['observacao']);
        this.paymentFormEdit.get('cmbInOutEdit').setValue(inOut);
        this.paymentFormEdit.get('txtBudgetEdit').setValue(paymentEdit['orcamento_id']);
        
        console.log(this.paymentFormEdit.get('txtDateEdit').value);
        //let date: string[] = paymentEdit['data'].split('/');
        //this.dPickerEdit.setDate(new Date(parseFloat(date[2]), parseFloat(date[1])-1, parseFloat(date[0])));
        this.dPickerEdit.setDate(paymentEdit['data']);
        
        document.getElementById("editPayment").click();
    }
    
    submitEditPayment(){
        var self = this;
        this.spinner.show();
        
        var inOut: number = 0;
        if(this.paymentFormEdit.get('cmbInOutEdit').value == "Entrada"){
            inOut = 1;   
        }
        
        console.log(this.paymentFormEdit.get('txtDateEdit').value);
        
        var params = {bill: this.paymentFormEdit.get('txtBillEdit').value, date: this.paymentFormEdit.get('txtDateEdit').value, check: this.paymentFormEdit.get('txtCheckNumberEdit').value, status: this.paymentFormEdit.get('cmbStatusEdit').value, value: this.paymentFormEdit.get('txtValueEdit').value, paymentForm: this.paymentFormEdit.get('cmbPaymentFormEdit').value, note: this.paymentFormEdit.get('txtNoteEdit').value, paymentType: this.paymentFormEdit.get('cmbTypePaymentEdit').value, id: this.paymentId, inOut: inOut, budgetId: self.paymentFormEdit.get('txtBudgetEdit').value};
        
        console.log(params);
        
        var payment = this.filteredPayments.find(function(data){
           return data['id'] == self.paymentId; 
        });
            
        this.appService.postEditPayment(params).subscribe(function(data){
           alert("Pagamento Editado!");
            var inOut: boolean = false;
            if(self.paymentFormEdit.get('cmbInOutEdit').value == "Entrada"){
                inOut = true;
            }else{
                inOut = false;
            }
            
            payment['conta'] = self.paymentFormEdit.get('txtBillEdit').value;
            var auxDate  = self.paymentFormEdit.get('txtDateEdit').value.split('/');
            payment['data'] = new Date(parseFloat(auxDate[2]), parseFloat(auxDate[1])-1, parseFloat(auxDate[0]));
            payment['numeroCheque'] = self.paymentFormEdit.get('txtCheckNumberEdit').value;
            payment['status'] = self.paymentFormEdit.get('cmbStatusEdit').value;
            payment['valor'] = self.appService.converteFloatMoeda(self.paymentFormEdit.get('txtValueEdit').value);
            payment['formaPagamento_formaPagamento'] = self.paymentFormEdit.get('cmbPaymentFormEdit').value;
            payment['observacao'] = self.paymentFormEdit.get('txtNoteEdit').value;
            payment['tipoPagamento_tipoPagamento'] = self.paymentFormEdit.get('cmbTypePaymentEdit').value;
            payment['entrada'] = inOut;
            payment['orcamento_id'] = self.paymentFormEdit.get('txtBudgetEdit').value;
            document.getElementById("editPayment").click();
            self.spinner.hide();
        });
    }
    
    stringQuery(): string{
        var self = this;
        var query: string = "";
        this.paymentsParts.forEach(function(data, index){
            if(index == 0){
                query = query + "(" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + data.type  + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType + "'," + data.budgetId + ")";
            } else{
                query = query + ", (" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + data.type  + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType + "'," + data.budgetId + ")";
            }
        });
        return query;
    }
    
    removePayment(data: any){
        console.log(data);
        var self = this;
        var i = 0;
        this.spinner.show();
        i = self.payments.indexOf(self.payments.find(function(value){
            return value['id'] == data['id'];
        }));
        
        this.appService.postRemovePayment({paymentId: data['id']}).subscribe(function(value){
            self.payments = self.payments.slice(0,i).concat(self.payments.slice(i+1,self.payments.length));
            //self.payments = self.payments.filter((v)=>{return v != data});
            self.filteredPayments = self.filteredPayments.filter((v)=>{return v != data});
            //self.filteredPayments = self.filteredPayments.slice(0,i).concat(self.filteredPayments.slice(i+1,self.filteredPayments.length));
            alert("Pagamento Removido");
            self.spinner.hide();
        });
        
        
    }
    
    
    
    addNewPaymentForm(){
        this.appService.postInsertPaymentForm({query: "'" + this.paymentFormForm.get('txtPaymentForm').value + "'"}).subscribe(function(data){
        });
    }
    
    addNewPaymentType(){
        this.appService.postInsertPaymentType({query: "'" + this.paymentTypeForm.get('txtPaymentType').value + "'"}).subscribe(function(data){
        });
    }
    
    barChartClick(e: any){
        var period = e.active[0]['_chart'].getElementAtEvent(e.event)[0]['_view']['datasetLabel'] + " " + e.active[0]['_chart'].getElementAtEvent(e.event)[0]['_view']['label'];
        var parameters = period.split(" ");
        var startDate = new Date(parseFloat(parameters[2]), this.months.indexOf(parameters[1]), 1);
        var endDate = new Date(parseFloat(parameters[2]), this.months.indexOf(parameters[1]) + 1, 0);
        var type = parameters[0];
        
        var payments = this.payments.filter((data)=>{
            return this.filterDataDate(data, 'data', startDate, endDate) && data['categoria'] == type && !data['entrada'];
        });
        
        this.reportPayments = payments;
        document.getElementById('btnModalCategoryPayments').click();
    }
    
    processGeneralReportPromise(): Promise<any>{
        return new Promise((resolve, reject)=>{
            var self = this;

            var fixValue: number[] = [];
            var variableValue: number[] = [];
            var pontualValue: number[] = [];
            var employeeValue: number[] = [];
            var monthRevenueValue: number[] = [];
            var monthCostValue: number[] = [];

            var paymentCategories: string[] = [];

            var monthStart: number = this.months.indexOf(this.generalReportForm.get('cmbMonthStartReport').value) + 1;
            var yearStart: number = this.generalReportForm.get('cmbYearStartReport').value
            var monthEnd: number = this.months.indexOf(this.generalReportForm.get('cmbMonthEndReport').value) + 1;
            var yearEnd: number = this.generalReportForm.get('cmbYearEndReport').value

            var startDate = new Date(yearStart, monthStart - 1, 1);
            var endDate = new Date(yearEnd, monthEnd - 1, 1);
            endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

            var arrayDates= [];

            var payments = this.payments.filter(function(data){
                return self.filterDataDate(data, 'data', startDate, endDate);
            });

            var labels: string[] = [];

            this.paymentCategory.forEach((data, index)=>{
                if(paymentCategories.indexOf(data) <0){
                    paymentCategories.push(data);
                }
            })
            
            
            var loop = true;
            var auxDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay());
            while(loop){
                labels.push(this.months[auxDate.getMonth()] + " " + auxDate.getFullYear());
                auxDate = new Date(auxDate.setMonth(auxDate.getMonth() + 1));
                if(auxDate > endDate){
                    loop = false;
                }
            }
            this.barChartLabels = labels;
            
            var sDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
            var eDate = new Date(sDate.getFullYear(), sDate.getMonth() + 2, 0);
            
            labels.forEach((data, i)=>{
                arrayDates.push({startDate: sDate, endDate: eDate});
                
                sDate = new Date(sDate.setMonth(sDate.getMonth() + 1));
                eDate = new Date(sDate.getFullYear(), sDate.getMonth() + 2, 0);
            })
            


            arrayDates.forEach((data, index)=>{
                var p = payments.filter((value)=>{
                    
                    return this.filterDataDate(value, 'data', data['startDate'], data['endDate']);
                })
                
                // Payments separated by IN and OUT --------------------------------------------------------------
                var inPayments: Payment[] = this.transformFilteredPayments(p).filter((v)=>{ return v.status == 'Entrada'; });
                var outPayments: Payment[]  = this.transformFilteredPayments(p).filter((v)=>{ return v.status == 'Saída'; });
                // -----------------------------------------------------------------------------------------------
                paymentCategories.forEach((pc)=>{
                    var payments = outPayments.filter((v)=>{return v.paymentCategory == pc});
                    var totalValue: number = this.paymentReportService.getTotalValue(payments);
                    if(pc == "Fixo"){ fixValue.push(this.appService.toFixed2(totalValue))}
                    else if(pc == "Variável"){ variableValue.push(this.appService.toFixed2(totalValue))}
                    else if(pc == "Pontual"){pontualValue.push(this.appService.toFixed2(totalValue))}
                    else if(pc == "Funcionário"){employeeValue.push(this.appService.toFixed2(totalValue))}
                })

                monthCostValue.push(this.appService.toFixed2(this.paymentReportService.getTotalValue(outPayments)));
                monthRevenueValue.push(this.appService.toFixed2(this.paymentReportService.getTotalValue(inPayments)));
            })

            this.barChartDatasets[0]['data'] = fixValue;
            this.barChartDatasets[1]['data'] = variableValue;
            this.barChartDatasets[2]['data'] = pontualValue;
            this.barChartDatasets[3]['data'] = employeeValue;
            this.barChartDatasets[4]['data'] = monthRevenueValue;
            this.barChartDatasets[5]['data'] = monthCostValue;


            resolve("Executado com sucesso.");
        })
    }
    
      processGeneralReport(e){
          this.processGeneralReportPromise().then((response)=>{
              this.releaseGeneralReport = true;
          })
      }
    
    // FUNÇÃO QUE PREENCHE PARÂMETROS PARA GERAÇÃO DO GRÁFICO ------------------------------------------------
    chartGenerator(){
        // Payments separated by IN and OUT --------------------------------------------------------------
        var inPayments: Payment[] = this.transformFilteredPayments(this.filteredPayments).filter((v)=>{ return v.status == 'Entrada'; });
        var outPayments: Payment[]  = this.transformFilteredPayments(this.filteredPayments).filter((v)=>{ return v.status == 'Saída'; });
        // -----------------------------------------------------------------------------------------------
        // Total value of IN and OUT Payments ------------------------------------------------------------
        var totalValueIn: number = this.paymentReportService.getTotalValue(inPayments);
        var totalValueOut: number = this.paymentReportService.getTotalValue(outPayments);
        // -----------------------------------------------------------------------------------------------
        // Types of IN and OUT Payments ------------------------------------------------------------------
        var inTypes: string[] = this.paymentReportService.getPaymentTypes(inPayments);
        var outTypes: string[] = this.paymentReportService.getPaymentTypes(outPayments);
        // -----------------------------------------------------------------------------------------------
        // Payments Separated by IN and OUT with total value ---------------------------------------------
        var inPaymentsByType: PaymentByType[] = this.paymentReportService.joinPaymentsByType(inPayments, inTypes);
        var outPaymentsByType: PaymentByType[] = this.paymentReportService.joinPaymentsByType(outPayments, outTypes);
        // -----------------------------------------------------------------------------------------------
        
        
        this.dataPieChart = [];
        this.labelPieChart = [];
        
        outPaymentsByType.forEach((p, index)=>{
            if(index < 5){
                this.dataPieChart.push(this.appService.toFixed2(p.totalValue));
                this.labelPieChart.push(p.type);
            }
            
        })
        
    }
    // -------------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE TRANSFORMA TIPO 'OBJECT' EM PAYMENT ---------------------------------------------
    transformFilteredPayments(filteredPayments: Object[]): Payment[]{
        var payments: Payment[] = [];
        filteredPayments.forEach((data)=>{
            let p = {} as Payment;
            p.id = data['id'];
            p.bill = data['conta'];
            p.budgetId = data['orcamento_id'];
            p.check = data['numeroCheque'];
            p.date = data['data'];
            p.note = data['observacao'];
            p.part = '0';
            p.paymentForm = data['formaPagamento_formaPagamento'];
            p.paymentType = data['tipoPagamento_tipoPagamento'];
            p.status = data['entrada'] ? "Entrada" : "Saída";
            p.type = "";
            p.value = this.appService.converteMoedaFloat(data['valor']);
            p.paymentCategory = this.paymentCategory[this.paymentType.indexOf(p.paymentType)];
            payments.push(p);
        })
        return payments;
    }
    // --------------------------------------------------------------------------------------------
    
    paymentReport(){
        var payments: Payment[] = this.transformFilteredPayments(this.filteredPayments);
        
        var datePipe = new DatePipe('en-US');
        var startDate = datePipe.transform(this.startDateFilter, 'dd/MM/yyyy');
        var endDate = datePipe.transform(this.endDateFilter, 'dd/MM/yyyy');
        
        this.paymentReportService.processPaymentReport(payments, startDate, endDate);
    }
    
    
    
  ngOnInit() {
      var self = this;
      setTimeout(()=> {self.spinner.show();}, 100)
      
      this.route.queryParams.subscribe(function(data){
            self.requestId = parseFloat(data['id']);
          if(data['id'] != undefined){
            document.getElementById("openModalPaymentButton").click();
            self.spinner.hide();
          }else{
              self.requestId = 0;
          }

      })
      
      this.generalReportForm = this.formBuilder.group({
        cmbMonthStartReport: this.formBuilder.control('', [Validators.required]),
        cmbYearStartReport: this.formBuilder.control('', [Validators.required]),
        cmbMonthEndReport: this.formBuilder.control('', [Validators.required]),
        cmbYearEndReport: this.formBuilder.control('', [Validators.required]),
    })
      
    this.paymentForm = this.formBuilder.group({
        rdInOut: this.formBuilder.control('', [Validators.required]),
        txtInstallment: this.formBuilder.control('', [Validators.required]),
        txtDate: this.formBuilder.control('', [Validators.required]),
        txtBill: this.formBuilder.control('', [Validators.required]),
        txtValue: this.formBuilder.control('0', [Validators.required]),
        cmbStatus: this.formBuilder.control('', [Validators.required]),
        cmbPaymentForm: this.formBuilder.control('', [Validators.required]),
        txtCheckNumber: this.formBuilder.control('', []),
        cmbTypePayment: this.formBuilder.control('', [Validators.required]),
        txtNote: this.formBuilder.control('', []),
        txtBudget: this.formBuilder.control('1', []),
    })
      
      this.paymentFormEdit = this.formBuilder.group({
        txtDateEdit: this.formBuilder.control('', [Validators.required]),
        txtBillEdit: this.formBuilder.control('', [Validators.required]),
        txtValueEdit: this.formBuilder.control('0', [Validators.required]),
        cmbStatusEdit: this.formBuilder.control('', [Validators.required]),
        cmbPaymentFormEdit: this.formBuilder.control('', [Validators.required]),
        txtCheckNumberEdit: this.formBuilder.control('', []),
        cmbTypePaymentEdit: this.formBuilder.control('', [Validators.required]),
        txtNoteEdit: this.formBuilder.control('', []),
        cmbInOutEdit: this.formBuilder.control('', []),
        txtBudgetEdit: this.formBuilder.control('1', [])
    });
      
      this.filterForm = this.formBuilder.group({
        cmbInOut: this.formBuilder.control('', []),
        txtDate: this.formBuilder.control('', []),
        txtBill: this.formBuilder.control('', []),
        txtValue: this.formBuilder.control(null, []),
        cmbStatus: this.formBuilder.control('', []),
        cmbPaymentForm: this.formBuilder.control('', []),
        txtCheckNumber: this.formBuilder.control('', []),
        cmbTypePayment: this.formBuilder.control('', []),
        txtNote: this.formBuilder.control('', []),
        txtId: this.formBuilder.control('', [])
    });
      
      this.paymentTypeForm = this.formBuilder.group({
        txtPaymentType: this.formBuilder.control('', [Validators.required])
    });
      
      this.paymentFormForm = this.formBuilder.group({
        txtPaymentForm: this.formBuilder.control('', [Validators.required]),
    });
      

      //setTimeout(() => {this.dPicker.setDate(new Date(2019,1,30))}, 100);
        
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

            self.chartGenerator();
        }
    });
      
        this.paymentForm.get('txtInstallment').valueChanges.subscribe(function(data){
            if(data != ""){
                setTimeout(() => {
                    self.paymentsParts = [];
                    self.totalParts = parseFloat(data);
                    for(let i = 0; i < self.totalParts; i++){
                        self.paymentsParts.push(self.newPayment());
                    }
                    self.showForm = true;
                    self.enableOkFunction();
                }, 500);
            }
        });
      
        self.appService.postSearchPaymentForm().subscribe(function(data){
            self.paymentWay = [""];
            data.map(function(value){
                self.paymentWay.push(value['formaPagamento']);
            }); 
        })
      
      self.appService.postSearchPaymentType().subscribe(function(data){
            self.paymentType = [""];
            data.map(function(value){
                self.paymentType.push(value['tipoPagamento']);
                self.paymentCategory.push(value['categoria']);
            });
        })
      
      var datePipe = new DatePipe('en-US');
      
      self.appService.postPayment({}).subscribe(function(data){
          //let date = data['data'].split('/');
          self.payments = data;
          self.payments.map(function(value){
              let date = value['data'].split('/');
              if(value['entrada']['data'][0] ==  1){
                  value['entrada'] = true;
              }else{
                  value['entrada'] = false;
              }
              value['valor'] = self.appService.converteFloatMoeda(value['valor'].replace(',','.'));
              //value['data'] = datePipe.transform(new Date(date[2], date[1]-1, date[0]), 'dd/MM/yyyy');
              value['data'] = new Date(date[2], date[1]-1, date[0]);
              
          })
          self.filteredPayments = self.payments;
          self.setTotalValue();
          self.spinner.hide();
          self.chartGenerator();
      });
  }
    
    ngAfterViewInit(){
    }
}