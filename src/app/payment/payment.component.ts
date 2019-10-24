import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {Payment} from './payment.model';
import {DatePickerComponent} from '../shared/date-picker/date-picker.component';
import {RadioOption} from '../shared/radio/radio-option.model';

@Component({
  selector: 'sivp-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
    
    payments: Object[] = [];
    self: any = this;
    paymentForm: FormGroup;
    status: string[] = ['', 'Pago', 'Não Pago', 'Cheque a Compensar'];
    paymentWay: string[] = ['', 'Cartão Crédito', 'Cartão Débito', 'Cheque', 'Dinheiro'];
    paymentType: string[] = ['', 'Salario', 'Investimento', 'Maquinario', 'Insumos'];
    totalParts: number = 0;
    currentPart: number = 1;
    paymentsParts: Payment[] = [];
    enableOk: boolean = false;
    @ViewChild('dPicker') dPicker: DatePickerComponent;
    inOut: RadioOption[] = [
        {label: 'Entrada', value: 'IN'},
        {label: 'Saída', value: 'OUT'}
    ]
    inOutPayment: string;
    showForm: boolean = false;
    
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
        
    }
    
    changePayment(type: string){
        this.applyChangesPayment();
        this.updatePaymentForm(type);
        //---------------------------------------------------------  CLIQUE NO BOTÃO NEXT  ---------------------------------------------------------
        if(type=="next"){
            if(this.currentPart < this.totalParts){
                this.currentPart = this.currentPart + 1;
            }
        //---------------------------------------------------------  CLIQUE NO BOTÃO ANTERIO  ---------------------------------------------------------    
        }else{
            if(this.currentPart > 1){
                this.currentPart = this.currentPart - 1;
            }
        }
        this.enableOkFunction();
        console.log(this.paymentsParts);
    }
    
    newPayment(): Payment{
        return {type: "", date: "", bill: "", part: "", value: 0, status: "", check: "", paymentForm: "", paymentType: "", note: ""};
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
            alert("Pagamentos Registrados!");
            document.getElementById('closeButton').click();
            self.spinner.hide();
        })   
    }
    stringQuery(): string{
        var self = this;
        var query: string = "";
        this.paymentsParts.forEach(function(data, index){
            if(index == 0){
                query = query + "(" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + data.type  + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType +  "'" + ")";
            } else{
                query = query + ", (" + "'" + data.bill + "'" + "," + "'" + data.date + "'" + "," + "'" + data.type +  "'" + "," +  "'" + data.check + "'" + "," +  "'" + data.status +  "'" + "," +  "'" + data.value + "'" + "," +  "'" + data.paymentForm +  "'" + "," +  "'" + data.note +  "'" + "," +  "'" + data.paymentType +  "'" + ")";
            }
        });
        return query;
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
    })
      
      //setTimeout(() => {this.dPicker.setDate(new Date(2019,1,30))}, 100);
        
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
      
      self.appService.postPayment({}).subscribe(function(data){
          self.payments = data;
          self.payments.map(function(value){
              if(value['entrada']['data'][0] ==  1){
                  value['entrada'] = true;
              }else{
                  value['entrada'] = false;
              }
          })
          console.log(self.payments);
          self.spinner.hide();
      });
  }
    
    ngAfterViewInit(){
        //let date = new Date(2011, 11, 31);
        //this.dPicker.setValue("01/11/2019");
    }
}
