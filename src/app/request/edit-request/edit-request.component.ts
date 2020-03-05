import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {DatePickerComponent} from '../../shared/date-picker/date-picker.component';
import {RadioOption} from '../../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {NewRequestBudgets} from '../new-request/new-request-budgets.model';
import {RequestHeader} from './edit-request.model';

@Component({
  selector: 'sivp-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {

    constructor(private route: ActivatedRoute, private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }

    /***** START VARIABLES **************/
    
    /******* START CONTROL VARIABLES OF PAYMENT FORM *******************/
        paymentForm: FormGroup;
        paymentFormEdit: FormGroup;
        totalParts: number = 0;
        currentPart: number = 1;
        status: string[] = ['', 'Pago', 'Não Pago', 'Cheque a Compensar'];
        payments: Object[] = [];
        paymentId = 0;
        @ViewChild('dPickerEdit') dPickerEdit: DatePickerComponent;
    
    /******* END CONTROL VARIABLES OF PAYMENT FORM *******************/
    
    header = {} as RequestHeader;
    self: any;
    enableEditRequestButton: boolean = false;
    
    requestId: number;
    request: any;
    requestBudgets: any;
    requestItemsBudgets: any;
    requestPayments: any;
    requestBudgetItemsBudgets: any;
    requestsData: Object[];
    totalValueRequest: number = 0;
    totalValuePayments: string;
    totalValueNotPayed: number;
    totalValuePayed: number;
    
    requestBudget: NewRequestBudgets[] = [];
    
    dataFromRequest: Object[] = [];
    budgetsFromRequest: any;
    
    headerTable: string[] = ['Qtd', 'Código', 'Item', 'Detalhe', 'Medida', 'Ambiente', 'Necessario', 'Valor Unit.', 'Valor Total', 'Desconto', 'Valor c/ Desc.'];
    idItemBudget: string[] = ['quantidade', 'codigo', 'item', 'detalhe', 'medida', 'comodo', 'necessario', 'valorUnitario', 'valorTotal', 'desconto', 'valorComDesconto'];
    
    budgetsStore: Object[] = [];
    /***** END VARIABLES **************/
    
    /***** START FUNCTIONS **************/
    
    /*********************** START PAYMENT CONTROL FUNCTIONS *******************/

    submitEditPayment(){
        var self = this;
        this.spinner.show();
        
        var inOut: number = 0;
        if(this.paymentFormEdit.get('cmbInOutEdit').value == "Entrada"){
            inOut = 1;   
        }
        var params = {bill: this.paymentFormEdit.get('txtBillEdit').value, date: this.paymentFormEdit.get('txtDateEdit').value, check: this.paymentFormEdit.get('txtCheckNumberEdit').value, status: this.paymentFormEdit.get('cmbStatusEdit').value, value: this.paymentFormEdit.get('txtValueEdit').value, paymentForm: this.paymentFormEdit.get('cmbPaymentFormEdit').value, note: this.paymentFormEdit.get('txtNoteEdit').value, paymentType: this.paymentFormEdit.get('cmbTypePaymentEdit').value, id: this.paymentId, inOut: inOut, budgetId: self.paymentFormEdit.get('txtBudgetEdit').value};
        
        var payment = this.payments.find(function(data){
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
            payment['data'] = self.paymentFormEdit.get('txtDateEdit').value;
            payment['numeroCheque'] = self.paymentFormEdit.get('txtCheckNumberEdit').value;
            payment['status'] = self.paymentFormEdit.get('cmbStatusEdit').value;
            payment['valor'] = self.paymentFormEdit.get('txtValueEdit').value;
            payment['formaPagamento_formaPagamento'] = self.paymentFormEdit.get('cmbPaymentFormEdit').value;
            payment['observacao'] = self.paymentFormEdit.get('txtNoteEdit').value;
            payment['tipoPagamento_tipoPagamento'] = self.paymentFormEdit.get('cmbTypePaymentEdit').value;
            payment['entrada'] = inOut;
            payment['orcamento_id'] = self.paymentFormEdit.get('txtBudgetEdit').value;
            document.getElementById("editPayment").click();
            self.spinner.hide();
            self.setTotalValuePayments();
            self.checkStatusRequest();
        });
    }
    
    editPayment(id: any){
        var paymentEdit = this.payments.find(function(data){return data['id'] == id});
        this.paymentId = id;
        console.log(paymentEdit);
        var inOut: string = "";
        if(paymentEdit['entrada']){
            inOut = "Entrada";
        }else{
            inOut = "Saída";
        }
        
        console.log(this.appService.converteMoedaFloat(paymentEdit['valor']));
        
        this.paymentFormEdit.get('txtDateEdit').setValue(paymentEdit['data']);
        this.paymentFormEdit.get('txtBillEdit').setValue(paymentEdit['conta']);
        this.paymentFormEdit.get('txtValueEdit').setValue(paymentEdit['valor'].replace(',','.'));
        this.paymentFormEdit.get('cmbStatusEdit').setValue(paymentEdit['status']);
        this.paymentFormEdit.get('cmbPaymentFormEdit').setValue(paymentEdit['formaPagamento_formaPagamento']);
        this.paymentFormEdit.get('txtCheckNumberEdit').setValue(paymentEdit['numeroCheque']);
        this.paymentFormEdit.get('cmbTypePaymentEdit').setValue(paymentEdit['tipoPagamento_tipoPagamento']);
        this.paymentFormEdit.get('txtNoteEdit').setValue(paymentEdit['observacao']);
        this.paymentFormEdit.get('cmbInOutEdit').setValue(inOut);
        this.paymentFormEdit.get('txtBudgetEdit').setValue(paymentEdit['orcamento_id']);
        
        let date: string[] = paymentEdit['data'].split('/');
        this.dPickerEdit.setDate(new Date(parseFloat(date[2]), parseFloat(date[1])-1, parseFloat(date[0])));
        
        document.getElementById("editPayment").click();
    }
    
    /*********************** END PAYMENT CONTROL FUNCTIONS *******************/
    removeItem(budgetId: any, budgetItemId: any){
        var rem = this.requestBudget.find((v) => {return v.budgetId == budgetId})['budgetItems'].find((v) => {return v['id'] == budgetItemId});
        this.requestBudget.find((v) => {return v.budgetId == budgetId})['budgetItems'] = this.requestBudget.find((v) => {return v.budgetId == budgetId})['budgetItems'].filter((v) => v != rem);
        this.requestBudget.find((v) => {return v.budgetId == budgetId})['totalValue'] = parseFloat((this.requestBudget.find((v) => {return v.budgetId == budgetId})['totalValue'] - parseFloat(rem['valorTotal'])).toFixed(2));
        this.requestBudget.find((v) => {return v.budgetId == budgetId})['discountValue'] = parseFloat((this.requestBudget.find((v) => {return v.budgetId == budgetId})['discountValue'] - parseFloat(rem['valorComDesconto'])).toFixed(2));
        this.updateRequestValue();
        this.enableEditRequestButton = true;
    }
    
    updateRequestValue(){
        var self = this;
        console.log(self.totalValueRequest);
        self.totalValueRequest = 0;
        self.requestBudget.forEach(function(data){
            self.totalValueRequest = self.totalValueRequest + data['discountValue'];
        });
        self.totalValueRequest = parseFloat(self.totalValueRequest.toFixed(2));
    }
    
    initializeVariables(){
        var self = this;
        
        console.log(this.requestsData);
        this.request = this.requestsData[0];
        this.requestBudgets = this.requestsData[1];
        this.requestItemsBudgets = this.requestsData[2];
        this.requestPayments = this.requestsData[3];
        this.requestBudgetItemsBudgets = this.requestsData[4];
        this.fillNewRequestBudgets();
        
        
    }
    
    fillNewRequestBudgets(){
        var self = this;
        this.self = this;
        
        this.appService.postSearchDataFromRequest({id: this.requestId}).subscribe(function(data){
            self.dataFromRequest = data;
            self.requestBudgetItemsBudgets = data[0];
            self.budgetsFromRequest = data[1];
            self.budgetsFromRequest.forEach(function(value){
                self.appService.postSearchBudgetItemByBudget({budgetId: value['id']}).subscribe(function(v){
                    var nrb = {} as NewRequestBudgets;

                    nrb.budgetId = value['id'];
                    nrb.clientId = value['clientId'];
                    nrb.discount = value['desconto'];
                    nrb.totalValue = 0;
                    nrb.budgetItems = v;
                    
                    self.requestBudgetItemsBudgets.filter((v) => {return v['orcamento_id'] == value['id']}).forEach(function(v){
                        nrb.totalValue = nrb.totalValue + parseFloat(v['valorTotal'].replace(',','.'));
                    })
                    nrb.discountValue = nrb.totalValue - (nrb.totalValue * nrb.discount / 100);
                    self.requestBudget.push(nrb);
                    self.totalValueRequest = self.totalValueRequest + nrb.discountValue;
                })
            });
        })
    }
    
    setRequestHeader(){
        console.log(this.requestsData);
        this.header.requestId = this.requestId;
        this.header.date = this.requestsData[0][0]['data'];
        this.header.paymentDate = this.requestsData[0][0]['dataPrevistaPagamento'];
        this.header.store = this.requestsData[0][0]['nomeCliente'];
        this.header.status = this.requestsData[0][0]['status'];
    }
    
    setTotalValuePayments(){
        var self = this;
        var totalValue: number = 0;
        self.totalValuePayed = 0;
        self.totalValueNotPayed = 0;
        this.payments.forEach(function(data){
            console.log(data);
            totalValue = totalValue + parseFloat(data['valor'].toString().replace(',','.'));
            if(data['status'] == "Pago"){
                self.totalValuePayed = self.totalValuePayed + parseFloat(data['valor'].toString().replace(',','.'));
            }else{
                self.totalValueNotPayed = self.totalValueNotPayed + parseFloat(data['valor'].toString().replace(',','.'));
            }
        })
        this.totalValuePayments = this.appService.converteFloatMoeda(totalValue);
        console.log(self.totalValuePayed - self.totalValueRequest);
        console.log(self.totalValueRequest - (self.totalValueRequest * 0.1));
        
    }
    
    checkStatusRequest(){
        var self = this;
        
        console.log(self.totalValuePayed);
        console.log(self.totalValueRequest);
        console.log(self.requestsData[0][0]['status']);
        
        if(self.totalValuePayed == 0){
            document.getElementById("editStatusNotPayed").click();
        }
        else if(((self.totalValueRequest - self.totalValuePayed) <= (self.totalValueRequest * 0.1)) && self.requestsData[0][0]['status'] != "Pago") {
           document.getElementById("editStatus").click();
        }
        else if((self.totalValuePayed < self.totalValueRequest) && self.requestsData[0][0]['status'] != "Parcialmente Pago") {
           document.getElementById("editStatusPartialPayed").click();
        }
        
    }
    
    changeStatusRequest(flag: boolean, status?: string){
        var self = this;
        if(flag){
            self.appService.postUpdateRequestStatus({id: self.requestId, status: status}).subscribe(function(data){
                alert("Status alterado para "+ status +"!");
                self.header.status = status;
            })
        }
    }
    
    addBudgetRequest(id: any){
        this.spinner.show();
        var self = this;
        var params = {budgetId: id};
        
        this.appService.postSearchBudgetItemByBudget(params).subscribe(function(data){
            let newRequestBudget = {} as NewRequestBudgets;
            newRequestBudget.budgetId = id;
            newRequestBudget.budgetItems = data;
            newRequestBudget.totalValue = parseFloat(parseFloat(self.budgetsStore.find((v) => v['id'] == id)['valorTotal'].replace(',','.')).toFixed(2));
            newRequestBudget.discount = self.budgetsStore.find((v) => v['id'] == id)['desconto'];
            newRequestBudget.clientId = self.budgetsStore.find((v) => v['id'] == id)['clienteEmpresaa_id'];
            newRequestBudget.discountValue = parseFloat((newRequestBudget.totalValue - (newRequestBudget.totalValue * (parseFloat(newRequestBudget.discount) / 100))).toFixed(2));
            self.requestBudget.push(newRequestBudget);
            console.log(self.requestBudgets);
            console.log(data);
            self.updateRequestValue();
            self.spinner.hide();
        });
        this.enableEditRequestButton = true;
    }
    
    editRequest(){
        
    }
    /***** END FUNCTIONS **************/
    
    ngOnInit() {
        var self = this;
        this.self = this;
        /****************** START SET PARAMETERS *********************/
        this.route.queryParams.subscribe(function(data){
            self.requestId = data['id'];
            self.appService.postSearchAllFromRequest(data).subscribe(function(value){
                console.log(value);
                self.requestsData = value;
                self.initializeVariables();
                self.setRequestHeader();
                /*************** START FILL BUDGET SELLECTION ***********************/
                self.appService.postSearchBudgetByStoreId({id: self.requestsData[0][0]['cliente_id']}).subscribe(function(data){
                    console.log(data);
                    data.map(function(value){
                      if (value['desconto'] == null){
                          value = '0';
                      }  
                    })
                    self.budgetsStore = data;
                    self.budgetsStore.map((v) => {if(v['desconto'] == null){v['desconto'] = "0"}});
                    console.log(self.budgetsStore);
                });
                /*************** END FILL BUDGET SELLECTION *************************/
            });
            self.appService.postSearchPaymentFromRequest(data).subscribe(function(value){
                self.payments = value; 
                self.setTotalValuePayments();
            });
            
        });
        /****************** END SET PARAMETERS *********************/
        
        /****************** START SET PAYMENTFORM *********************/
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
        /****************** END SET PAYMENTFORM *********************/
        
        
        
    }
}