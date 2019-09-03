import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {soExecution} from '../so-execution.model';
import {CreatePdfSOComponent} from '../../create-pdf-so/create-pdf-so.component';
import {SoPdfModel} from '../../create-pdf-so/so-pdf.model';

@Component({
  selector: 'sivp-service-order-table',
  templateUrl: './service-order-table.component.html',
  styleUrls: ['./service-order-table.component.css']
})
export class ServiceOrderTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService, private formBuilder: FormBuilder, private createPdf: CreatePdfSOComponent) { }

    self = this;
    serviceOrders: Object[];
    id: number;
    openModal: Boolean;
    checks: string[] = [];
    shares: number[] = [];
    cbo: FormArray;
    io: FormArray;
    modalForm: FormGroup;
    executions: soExecution[] = [];
    employees: string[] = [];
    sharesEmployees: number[] = [];
    checkBoxFormArray: FormArray = new FormArray([]);
    queryShares: string = "";
    queryEmployees: string = "";
    stoneValue: number;
    searchEmployees: Object[];
    soValue: string;
    os: any;
    soPdfModel ={} as SoPdfModel;
    
    openModalFunction(open: boolean, id?: number, valor?: string){
        //this.openModal = open;
        var self = this;
        this.soValue = valor;
        document.getElementById("openModalButton").click();
        if(open){
            this.id = id;
            this.stoneValue = parseFloat((parseFloat(valor.replace(',','.')) * 0.4).toFixed(2));
            this.os = this.serviceOrders.find(v => v['id'] == this.id);
            if(this.os['valorEmpreita']){
                this.modalForm.get('txtEmpreitaValue').setValue(parseFloat(this.os['valorEmpreita'].replace(',','.')));
            }
        }else{
            this.resetModal();
        }
    }
    
    validateSum(): Boolean{
        var sum: number = 0;
        
        this.sharesEmployees.forEach(function(data){
            sum = sum + data;
        });
        
        if(sum == 100){
           return true;
        }else{
           return false;
        }
    }
    
    eventInput(i: number, value:string){
        var j = this.employees.indexOf(this.checks[i]);
        this.sharesEmployees[j] = parseFloat(this.modalForm.get('checkBoxOption').value[i]['employeeShare']);
        this.shares[i] = parseFloat(this.modalForm.get('checkBoxOption').value[i]['employeeShare']);
    }
    
    setValueCheckBox(i: number){
        var auxEmployees = this.employees;
        this.modalForm.get('checkBoxOption').value[i]['employeeName'] = !this.modalForm.get('checkBoxOption').value[i]['employeeName'];
        if(this.modalForm.get('checkBoxOption').value[i]['employeeName']){
            this.employees.push(this.checks[i]);
            this.sharesEmployees.push(this.shares[i]);
        } else{
            this.employees = this.employees.slice(0,this.employees.indexOf(this.checks[i])).concat(this.employees.slice(this.employees.indexOf(this.checks[i])+1,this.employees.length));
            this.sharesEmployees = this.sharesEmployees.slice(0,auxEmployees.indexOf(this.checks[i])).concat(this.sharesEmployees.slice(auxEmployees.indexOf(this.checks[i])+1,auxEmployees.length));
        }
        this.validateSum();
    }

   buildCbEmployee(){
       var self = this;
       
        this.checks.forEach(function(data, index){
           self.checkBoxFormArray.push(new FormGroup({
               employeeName: new FormControl(false,[]),
               employeeShare: new FormControl("100",[])
           }))     
           
        })

    }
    
    resetModal(){
        var self = this;
        this.modalForm.get('cbEmpreita').setValue(false);
        this.modalForm.get('cbStone').setValue(false);
        this.modalForm.get('txtDate').setValue('');
        this.modalForm.get('txtEmpreitaValue').setValue(0);
        this.modalForm.get('txtEmpreitaDate').setValue('');
        this.modalForm.get('txtStoneValue').setValue(0);
    }
    
    buildQuery(){
        if(this.validateSum() && this.modalForm.valid){
            var self = this;
            this.spinner.show();
            this.queryEmployees = "";
            this.queryShares = "";
            this.employees.forEach(function(data, index){
                if(index == self.employees.length - 1){
                    self.queryEmployees = self.queryEmployees + "(" + self.id + ",'" + data + "')";
                    self.queryShares = self.queryShares + "(" + self.id + "," + self.sharesEmployees[index] + ")";
                } else{
                    self.queryEmployees = self.queryEmployees + "(" + self.id + ",'" + data + "'),";
                    self.queryShares = self.queryShares + "(" + self.id + "," + self.sharesEmployees[index] + "),";
                }
            });
            this.appService.insertSOExecution(this.id, this.modalForm.get('txtDate').value.replace(/[\/]/g,'%2F'), this.modalForm.get('cbStone').value, this.modalForm.get('cbEmpreita').value, this.modalForm.get('txtStoneValue').value.toString().replace('.',','), this.queryEmployees.replace(/[\/]/g,'%2F'), this.queryShares).subscribe(function(data){
                self.openModalFunction(false);
                alert("Ordem de Serviço Lançada!");
                self.spinner.hide();
            });
        }
    }
    
    showTextBox(name: string): Boolean{
        if(this.employees.indexOf(name) != -1){
           return true;
        }else{
            return false;  
        }   
    }

    showStatus(value: string){
        if(value == "Empreita"){
            this.modalForm.get('cbEmpreita').setValue(!this.modalForm.get('cbEmpreita').value);
        }else if(value == "Stone"){
            this.modalForm.get('cbStone').setValue(!this.modalForm.get('cbStone').value);
            if(this.modalForm.get('cbStone').value){
               this.modalForm.get('txtStoneValue').setValue(this.stoneValue);
            }else{
               this.modalForm.get('txtStoneValue').setValue(0);
            }
        }
    }
    
    blobToBase64(blob){
        var self = this;
        var reader = new FileReader();
        var result;
        reader.onload = function(event) {
            console.log(event.target['result']);
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            
        };
        reader.readAsDataURL(blob);
    }
    
    exportPdf(idSO: number){
        var self = this;
        this.appService.serviceOrderId(idSO).subscribe(function(data){
            console.log(data);
            self.soPdfModel.id = data[0]['id'];
            self.soPdfModel.limitDate = data[0]['dataPrevisaoTermino'];
            self.soPdfModel.store = data[0]['loja'];
            self.soPdfModel.client = data[0]['cliente'];
            self.soPdfModel.material = "Material";
            self.soPdfModel.location = "9";
            self.soPdfModel.ambient = data[0]['comodo'];
            self.soPdfModel.item = data[0]['item'];
            self.soPdfModel.note = data[0]['observacao'];
            self.soPdfModel.image = data[0]['imagem'];
            console.log(self.soPdfModel);
        });
        
        //this.createPdf.gerarPDF();
    }
    
    ngOnInit() {
        setTimeout(()=> this.spinner.show(), 10);
        var self = this;
        
         this.modalForm = this.formBuilder.group({
            txtDate: this.formBuilder.control('',[Validators.required]), 
            checkBoxOption: this.checkBoxFormArray,
            cbEmpreita: this.formBuilder.control(false,[]),
            cbStone: this.formBuilder.control(false,[]),
            txtEmpreitaValue: this.formBuilder.control(0,[]),
            txtEmpreitaDate: this.formBuilder.control(new Date(),[]),
            txtStoneValue: this.formBuilder.control(0,[]) 
        });

        this.appService.searchAllEmployees().subscribe(function(data){
             data.map(function(v){
                 self.checks.push(v['nome']);
                 self.shares.push(100);
             });
            
            self.buildCbEmployee();
        });
        
        
        this.cbo = (this.modalForm.get('checkBoxOption') as FormArray);

        this.appService.searchAllServiceOrders().subscribe(function(data){
            self.serviceOrders = data;
            self.serviceOrders.map(function(value){
                value['empreita'] = value['empreita']['data'][0];
                value['pedra'] =  value['pedra']['data'][0];
                if(value['dataTermino']){
                    value['terminado'] = 1;
                }else{
                    value['terminado'] = 0;
                }
                
            });
            console.log(data[7]['imagem']);
            let blob = new Blob([data[6]['image']['data']], {type: 'image/png'});
            console.log(blob);
            self.blobToBase64(blob);
            /*self.serviceOrders.forEach(function(data){
                data['empreita'] =  data['empreita']['data'][0];
                data['pedra'] =  data['pedra']['data'][0];
            });*/

            self.spinner.hide();
        });
    }
}