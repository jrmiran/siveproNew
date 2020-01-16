import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {Payment} from './payment.model';
import {DatePickerComponent} from '../shared/date-picker/date-picker.component';
import {RadioOption} from '../shared/radio/radio-option.model';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sivp-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
    
    payments: Object[] = [];
    filteredPayments: Object[] = [];
    self: any = this;
    paymentForm: FormGroup;
    paymentFormEdit: FormGroup;
    paymentTypeForm: FormGroup;
    paymentFormForm: FormGroup;
    filterForm: FormGroup;
    status: string[] = ['', 'Pago', 'Não Pago', 'Cheque a Compensar'];
    paymentWay: string[] = ['', 'Cartão Crédito', 'Cartão Débito', 'Cheque', 'Dinheiro'];
    paymentType: string[] = ['', 'Salario', 'Investimento', 'Maquinario', 'Insumos'];
    totalParts: number = 0;
    currentPart: number = 1;
    paymentsParts: Payment[] = [];
    enableOk: boolean = false;
    paymentId: any;
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
            && self.filterDataDate(data, 'data', self.startDateFilter, self.endDateFilter);;
        });
        self.setTotalValue();
    }
    
    filterData(data: any, param:string, value: any, contains?: boolean){
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
        let date = data['data'].split('/');
        var auxDate: Date = new Date(date[2], date[1]-1, date[0]);
        
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
            this.paymentForm.get('txtValue').setValue(this.paymentsParts[this.currentPart].value);
        this.paymentForm.get('cmbStatus').setValue(this.paymentsParts[this.currentPart].status);
        this.paymentForm.get('cmbPaymentForm').setValue(this.paymentsParts[this.currentPart].paymentForm);
        this.paymentForm.get('txtCheckNumber').setValue(this.paymentsParts[this.currentPart].check);
        this.paymentForm.get('cmbTypePayment').setValue(this.paymentsParts[this.currentPart].paymentType);
        this.paymentForm.get('txtNote').setValue(this.paymentsParts[this.currentPart].note);
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
        console.log(this.paymentsParts);
    }
    
    newPayment(): Payment{
        return {type: "", date: "", bill: "", part: "", value: 0, status: "", check: "", paymentForm: "", paymentType: "", note: "", budgetId: 1};
    }
    
    setNewPayment(){
        this.dPicker.setDate(new Date());
    }
    
    submitPayments(){
        var self = this;
        this.spinner.show();
        this.applyChangesPayment();
        var params = {query: this.stringQuery()};
        this.appService.postInsertPayment(params).subscribe(function(data){
            var insertId: number = data['insertId'];
            console.log(insertId);
            console.log(self.paymentsParts);
            self.paymentsParts.forEach(function(value, index){
                console.log(value);
                self.filteredPayments.push({conta: value.bill, data: value.date, entrada: value.type, formaPagamento_formaPagamento: value.paymentForm, funcionario_id: null, id: insertId, numeroCheque: value.check, observacao: value.note, status: value.status, tipoPagamento_tipoPagamento: value.paymentType, valor: value.value, orcamento_id: value.budgetId});
                insertId = insertId + 1;
            });
            alert("Pagamentos Registrados!");
            document.getElementById('closeButton').click();
            self.spinner.hide();
        })   
    }
    
    submitEditPayment(){
        var self = this;
        this.spinner.show();
        
        var inOut: number = 0;
        if(this.paymentFormEdit.get('cmbInOutEdit').value == "Entrada"){
            inOut = 1;   
        }
        var params = {bill: this.paymentFormEdit.get('txtBillEdit').value, date: this.paymentFormEdit.get('txtDateEdit').value, check: this.paymentFormEdit.get('txtCheckNumberEdit').value, status: this.paymentFormEdit.get('cmbStatusEdit').value, value: this.paymentFormEdit.get('txtValueEdit').value, paymentForm: this.paymentFormEdit.get('cmbPaymentFormEdit').value, note: this.paymentFormEdit.get('txtNoteEdit').value, paymentType: this.paymentFormEdit.get('cmbTypePaymentEdit').value, id: this.paymentId, inOut: inOut, budgetId: self.paymentFormEdit.get('txtBudgetEdit').value};
        
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
        });
    }
    
    stringQuery(): string{
        var self = this;
        var query: string = "";
        console.log(this.paymentsParts);
        this.paymentsParts.forEach(function(data, index){
            if(index == 0){
                query = query + "(" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + data.type  + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType + "'," + data.budgetId + ")";
            } else{
                query = query + ", (" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + "'" + data.type +  "'" + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType + "'," + data.budgetId + ")";
            }
        });
        return query;
    }
    
    removePayment(data: any){
        var self = this;
        var i = 0;
        this.spinner.show();
        i = self.payments.indexOf(self.payments.find(function(value){
            return value['id'] == data['id'];
        }));
        
        this.appService.postRemovePayment({paymentId: data['id']}).subscribe(function(value){
            console.log(value);
            self.payments = self.payments.slice(0,i).concat(self.payments.slice(i+1,self.payments.length));
            self.filteredPayments = self.filteredPayments.slice(0,i).concat(self.filteredPayments.slice(i+1,self.filteredPayments.length));
            alert("Pagamento Removido");
            self.spinner.hide();
        });
        
        
    }
    
    
    addNewPaymentForm(){
        this.appService.postInsertPaymentForm({query: "'" + this.paymentFormForm.get('txtPaymentForm').value + "'"}).subscribe(function(data){
             console.log(data);
        });
    }
    
    addNewPaymentType(){
        this.appService.postInsertPaymentType({query: "'" + this.paymentTypeForm.get('txtPaymentType').value + "'"}).subscribe(function(data){
             console.log(data);
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
        
        
        this.paymentFormEdit.get('txtDateEdit').setValue(paymentEdit['data']);
        this.paymentFormEdit.get('txtBillEdit').setValue(paymentEdit['conta']);
        this.paymentFormEdit.get('txtValueEdit').setValue(this.appService.converteMoedaFloat(paymentEdit['valor']));
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
    
    
  ngOnInit() {
      var self = this;
      setTimeout(()=> {self.spinner.show();}, 100)
      
      
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
        txtNote: this.formBuilder.control('', [])
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
            
            console.log(self.startDateFilter);
            console.log(self.endDateFilter);
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
                    console.log(self.paymentsParts);
                    self.enableOkFunction();
                }, 500);
            }
        });
      
        self.appService.postSearchPaymentForm().subscribe(function(data){
            console.log(data);
            self.paymentWay = [""];
            data.map(function(value){
                self.paymentWay.push(value['formaPagamento']);
            }); 
        })
      
      self.appService.postSearchPaymentType().subscribe(function(data){
            console.log(data);
            self.paymentType = [""];
            data.map(function(value){
                self.paymentType.push(value['tipoPagamento']);
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
              value['data'] = datePipe.transform(new Date(date[2], date[1]-1, date[0]), 'dd/MM/yyyy');
              //value['data'] = new Date(date[2], date[1]-1, date[0]);
              
          })
          self.filteredPayments = self.payments;
          console.log(self.payments);
          self.setTotalValue();
          self.spinner.hide();
      });
  }
    
    ngAfterViewInit(){
    }
}