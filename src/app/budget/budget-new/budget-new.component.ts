import { Component, OnInit, Input, Directive, HostListener, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {AppService} from "../../app.service";
import {BudgetNew} from "./budget-new.model";
import {StartService} from '../../start.service';
import {CheckBox} from '../../shared/check/check-box.model';
import { ActivatedRoute, Router } from '@angular/router';
import {BudgetModel} from '../budget.model'
import {CreatePdfComponent} from '../../create-pdf/create-pdf.component'
import "rxjs/add/operator/map";
import {BudgetAmbient} from "./budget-ambient.model";
import { NgControl } from '@angular/forms';
import {Client} from '../../clients/client.model';
import {Terceiro} from '../../clients/terceiro.model';
import {BudgetInsertion} from '../budget-insertion.model';
import {Observable} from "rxjs/Observable";
import {SubItem} from "./sub-item.model";
import {NgxSpinnerService} from 'ngx-spinner';
import {KEY_CODE} from '../../shared/key-code/keyCode';
import {BudgetItem} from '../budget-item.model';

@Component({
  selector: 'sivp-budget-new',
  templateUrl: './budget-new.component.html',
  styleUrls: ['./budget-new.component.css']
})
export class BudgetNewComponent implements OnInit {
    
  constructor(private formBuilder: FormBuilder, private appService: AppService, private start: StartService, private router: ActivatedRoute, private spinner: NgxSpinnerService, private route: Router) { }
    
    @HostListener('window:keyup', ['$event'])
      keyEvent(event: KeyboardEvent) {
        console.log(event);

        if (event.keyCode === KEY_CODE.DELETE) {
          //this.removeItem();
        }
      }

    removeItem(i: number){
        //var i: number;
        //i = this.currentItem;
        
        this.mainBudget.valorTotal = parseFloat((this.mainBudget.valorTotal - this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal)).toFixed(2));
        
        if(this.currentItem >=0){
            this.budgets = this.budgets.slice(0,i).concat(this.budgets.slice(i+1,this.budgets.length));
        } else{
            alert("NÃO HÁ ITEM SELECIONADO");
        }
    }
    
    qtds: number[] = [];
    cods: string[] = [];
    itemss: string[] = [];
    detalhes: string[] = [];
    medidas: string[] = [];
    comodos: string[] = [];
    necessarios: string[] = [];
    valoresUnitarios: number[] = [];
    valoresTotais: number[] = [];
    descontos: number[] = [];
    valoresComDesconto: number[] = [];
    thirdyCnpj: string = "";
    thirdyCpf: string = "";
    
    qtdsString: string = "(";
    codsString: string = "(";
    itemsString: string = "(";
    detalhesString: string = "(";
    medidasString: string = "(";
    comodosString: string = "(";
    necessariosString: string = "(";
    valoresUnitariosString: string = "(";
    valoresTotaisString: string = "(";
    descontosString: string = "(";
    valoresComDescontoString: string = "(";
    currentValue: number;
    descriptionChangeItem: string;
    
    budgetEdited: boolean = false;
    
    listTest: string[] = ['a','b','c','d'];
    listTestString: string = "(";
    insertedBudget: any;
    
    numberValidator = /^[\d,.?!]+$/;
    //numberValidator = /[\d][,][\d]/;
    subItems: SubItem[] = [];
    loadPage: boolean = false;
    orderForm: FormGroup;
    modalForm: FormGroup;
    
    items: Object[];
    formin= {type: "", client: "", vendor: "", thirdy: "", date: "", poload: false};
    budgets: BudgetNew[] = [];
    budgetsAux: BudgetNew[] = [];
    main: BudgetNewComponent = this;
    places: string[] = [""];
    checks: string[] = [''];
    thirdy: Terceiro = {      name: "",
                              tel: "",
                              cel: "",
                              email: "",
                              address: "",
                              id_Thirdy: 0
                        };
    client:  Client = {
                           type: "",
                           name: "",
                           tel: "",
                           cel: "",
                           email: "",
                           address: "",
                           id_Client: 0,
                           id_Thirdy: 0,
                           id_vendor: 0
                       };
    params = {query:""};
    clientDataObj: Object[];
    thirdyDataObj: Object[];
    mainBudget: BudgetModel;
    clientData = {celular: "", email: "", id: 0, telefone: "", id_Client: 0, id_Thirdy: 0, id_vendor: 0};
    thirdyData = {celular: "", email: "", endereco: "", id: 0, nome: "", telefone: "", id_Thirdy: 0};
    bInsertion: BudgetInsertion = {
        aprovado: false,
        caminho: "",
        data: "",
        desconto: 0,
        observacao: "", //INSERIR CAMPO DE OBSERVAÇÃO NA DOM
        retificado: 1,
        tipoCliente: "", //MODIFICAR
        valorTotal: 0,
        arquiteto_id: 0,
        clienteEmpresa_id: 0, //this.clienteEmpresa_id;
        clienteEmpresaa_id: 0, //this.clienteEmpresaa_id;
        clienteJuridico_id: 0,
        pessoa_id: 0, //this.pessoa_id;
        vendedor_id: 0,//this.vendedor_id;
        poload: false
    };
    budgetItems: BudgetItem[] = [];
    
    
    addSubItem(index: number){
        var self = this;
        var valorTotalLocal: number;
        if(this.getSubItems(index).length == 0){
            this.budgets[this.currentItem].qtd = 0;
        }
        
        this.subItems.push({
            index: index,
            qtd: this.modalForm.get('qtdSubItem').value + "  ",
            unidade: this.modalForm.get('unidadeSubItem').value + "  ",
            medida1: this.modalForm.get('medida1SubItem').value,
            medida2: this.modalForm.get('medida2SubItem').value + "  ",
            descricao: this.modalForm.get('descricaoSubItem').value,
        });
        
        console.log(this.modalForm.get('medida1SubItem').value);
        console.log(this.modalForm.get('medida2SubItem').value);
        console.log((this.modalForm.get('medida1SubItem').value * this.modalForm.get('medida2SubItem').value *  this.modalForm.get('qtdSubItem').value));
        
        this.budgets[this.currentItem].qtd = parseFloat((this.budgets[this.currentItem].qtd + (this.modalForm.get('medida1SubItem').value * this.modalForm.get('medida2SubItem').value *  this.modalForm.get('qtdSubItem').value)).toFixed(2));
        
        this.budgets[this.currentItem].detalhe = this.budgets[this.currentItem].detalhe + "\n*" +  this.modalForm.get('qtdSubItem').value + " " + this.modalForm.get('unidadeSubItem').value + " " + parseFloat(this.modalForm.get('medida1SubItem').value).toFixed(2) + "x" + parseFloat(this.modalForm.get('medida2SubItem').value).toFixed(2) + " " + this.modalForm.get('descricaoSubItem').value;
        this.budgets[this.currentItem].valorTotal = this.appService.converteFloatMoeda(parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario)).toFixed(2)));
        
        if(isNaN(this.budgets[this.currentItem].valorTotal)){
            valorTotalLocal = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal)
        } else{
            valorTotalLocal = this.budgets[this.currentItem].valorTotal
        }
        
        console.log(this.budgets[this.currentItem].valorUnitario);
        this.modalForm.get('qtdSubItem').setValue("");
        this.modalForm.get('unidadeSubItem').setValue("");
        this.modalForm.get('medida1SubItem').setValue("");
        this.modalForm.get('medida2SubItem').setValue("");
        this.modalForm.get('descricaoSubItem').setValue("");
        
        this.mainBudget.valorTotal = parseFloat((parseFloat(this.mainBudget.valorTotal.toString()) + valorTotalLocal - this.currentValue).toFixed(2));
        console.log(this.mainBudget.valorTotal);
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.mainBudget.discount/100)).toFixed(2));
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal);
        console.log(this.currentValue);
        
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
    }
    
    removeSubItem(i: number, index: number){
        var self = this;
        var newQtd = 0;
        var valorTotalLocal = 0;
        this.subItems = this.subItems.slice(0,i).concat(this.subItems.slice(i+1,this.subItems.length));
        self.budgets[self.currentItem].detalhe = "";
        this.subItems.forEach(function(data){
            self.budgets[self.currentItem].detalhe = self.budgets[self.currentItem].detalhe + "*" + data.qtd + " " + data.unidade + parseFloat(data.medida1).toFixed(2) + " x " + parseFloat(data.medida2).toFixed(2) + " " + data.descricao + "\n";
            newQtd = newQtd + (data.medida1 * data.medida2);
        });

        this.budgets[this.currentItem].qtd = newQtd;
        this.budgets[this.currentItem].valorTotal = this.appService.converteFloatMoeda(parseFloat((newQtd * this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario)).toFixed(2)));
        
        
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
        
        this.mainBudget.valorTotal = parseFloat((parseFloat(this.mainBudget.valorTotal.toString()) + this.budgets[this.currentItem].valorTotal - this.currentValue).toFixed(2));
        console.log(this.mainBudget.valorTotal);
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.mainBudget.discount/100)).toFixed(2));
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal);
    }
    
    getSubItems(index: number): SubItem[]{
        var response: SubItem[] = [];
        this.subItems.forEach(function(data){
            if (data.index == index){
                response.push(data);
            }
        });
        return response;
    }
    
    changeAmbient(a: string){
        this.budgets[this.currentItem].comodo = a;
        this.groupByAmbient();
    }
    
    showSpinner(show: boolean){
        if(show){
            this.spinner.show();
        }else{
            this.spinner.hide();
        } 
    }
    
    setData(){
        this.clientData = Object.assign(this.clientData, this.clientDataObj[0]);
        this.thirdyData = Object.assign(this.thirdyData, this.thirdyDataObj[0]);
        //this.clientData = this.clientDataObj[0];
        //this.thirdyData = this.thirdyDataObj[0];
    }
    
    setMainBudget(){
        this.mainBudget = { number: 0,
                            rectified: 1,
                            client: this.client,
                            date: this.formin.date,
                            terceiro: this.thirdy,
                            vendor: this.formin.vendor,
                            valorTotal: 0,
                            discount: 0,
                            valorComDesconto: 0,
                            note: "",
                           freight: 0
                           };
    }
    
    setClient(){
        this.client = {
                           type: this.formin.type,
                           name: this.formin.client,
                           tel: this.client.tel,
                           cel: this.client.cel,
                           email: this.client.email,
                           address:  "",
                           id_Client: this.clientData.id,
                           id_Thirdy: this.thirdyData.id_Thirdy,
                           id_vendor: this.clientData.id_vendor
                        };
    }
    
    setThirdy(){
        this.thirdy = { name: this.formin.thirdy,
                        tel: this.thirdyData.telefone,
                        cel: this.thirdyData.celular,
                        email: this.thirdyData.email,
                        address: this.thirdyData.endereco,
                        id_Thirdy: this.thirdyData.id_Thirdy
                      };
    }
    
    
    sub: any;
    comods: string[];
    enableButton: boolean;
    currentItem: number = -1;
    createPdf = new CreatePdfComponent(this.appService);
    cbo: FormArray;
    budgetsAmbient: BudgetAmbient[] = [];
    newItem: BudgetAmbient = {comodo:"", qtd:[], cod:[], item:[], detalhe:[], medida:[], necessario:[], valor:[], valorTotal:[], valorTotalAmbiente:0};
    valuePattern = /^\d+.\d{2}$/;
    pedraOption: boolean = false;
    public myModel = '';
    public mask = [/^([1-9]{1}[\d]{0,2}(\.[\d]{3})*(\,[\d]{0,2})?|[1-9]{1}[\d]{0,}(\,[\d]{0,2})?|0(\,[\d]{0,2})?|(\,[\d]{1,2})?)$/];
    discount: number = 0;
    
    
    test(){
        var self = this;
        this.mainBudget.number = this.insertedBudget;
        this.mainBudget.note = this.orderForm.get('txtObservacao').value;
        //this.joinBudget();
        
        this.createPdf.gerarPDF(this.budgetsAmbient, this.mainBudget, self.thirdyCpf);
    }
    
    removePlace2(i: number){
        this.places = this.places.slice(0,i).concat(this.places.slice(i+1,this.places.length));
        this.checks = this.checks.slice(0,i).concat(this.checks.slice(i+1,this.checks.length));
        (this.orderForm.get('checkBoxOption') as FormArray).removeAt(i);
        this.cbo = (this.orderForm.get('checkBoxOption') as FormArray)
    }
    
    addPlace(place: string){
        this.places.push(place);
        this.checks.push(place);
        
        (this.orderForm.get('checkBoxOption') as FormArray).push(new FormControl(false));
        this.cbo = (this.orderForm.get('checkBoxOption') as FormArray);
    }
    
    setValueCheckBox(i: number){
            this.orderForm.value.checkBoxOption[i] = !this.orderForm.value.checkBoxOption[i];
    }
    
    setPedra(){
            this.pedraOption = !this.pedraOption;
            //this.orderForm.value.isPedra = this.pedraOption;
    }
    
    public clickRow(i: number){
        /*this.currentItem = i;
        console.log(this.currentItem);
        console.log(this.budgets[this.currentItem].valorUnitario);
        console.log(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtNecessario').setValue(this.budgets[this.currentItem].necessario);
        this.orderForm.get('txtMedida').setValue(this.budgets[this.currentItem].medida);
        this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);*/
        
        console.log("clickRow Edit")
        this.currentItem = i;
        setTimeout(()=>{
            this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        }, 10);
        console.log(this.budgets[this.currentItem].valorUnitario);
        console.log(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal);
        console.log(this.currentValue);
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtNecessario').setValue(this.budgets[this.currentItem].necessario);
        this.orderForm.get('txtMedida').setValue(this.budgets[this.currentItem].medida);
        this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
    }
    
    setCpf(){
        var self = this;
        if(self.thirdyCpf != ""){
            self.thirdyCpf = self.thirdyCpf.substring(0,3) + "." + self.thirdyCpf.substring(3,6) + "." + self.thirdyCpf.substring(6,9) + "-" + self.thirdyCpf.substring(9);
        }
    }
    
    changeItem(){
        var qtd: number = parseFloat(this.orderForm.get('txtQtd').value.toString().replace(',','.'));
        var valor: number = parseFloat(this.orderForm.get('txtValor').value.toString().replace(',','.'));
        var medida1: number = parseFloat(this.orderForm.get('txtMedida1').value.replace(',','.'));
        var medida2: number = parseFloat(this.orderForm.get('txtMedida2').value.replace(',','.'));
        var valorTotalLocal: number;
        
        this.budgets[this.currentItem].qtd = this.orderForm.get('txtQtd').value;
        this.budgets[this.currentItem].necessario = this.orderForm.get('txtNecessario').value;
        this.budgets[this.currentItem].detalhe = this.orderForm.get('txtDetalhe').value;
        this.budgets[this.currentItem].valorUnitario = this.appService.converteFloatMoeda(this.orderForm.get('txtValor').value);
        
        console.log(this.budgets[this.currentItem].valorUnitario);
        console.log(this.currentValue);
        if(this.pedraOption){
           this.budgets[this.currentItem].valorTotal = (medida1 * medida2 * valor)/ 10000; 
            this.budgets[this.currentItem].medida = this.orderForm.get('txtMedida1').value + " x " + this.orderForm.get('txtMedida2').value;
        } else{
            this.budgets[this.currentItem].valorTotal = this.appService.converteFloatMoeda(parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario)).toFixed(2)));
            this.budgets[this.currentItem].medida = this.orderForm.get('txtMedida').value;
        }
        
        console.log(this.budgets[this.currentItem].valorTotal);
        
        if(isNaN(this.budgets[this.currentItem].valorTotal)){
            valorTotalLocal = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal);
        } else{
            valorTotalLocal = this.budgets[this.currentItem].valorTotal;
        }
        console.log("MB VT: " + this.mainBudget.valorTotal);
        console.log("VTL: " + valorTotalLocal);
        console.log("CV: " + this.currentValue);
        this.mainBudget.valorTotal = parseFloat((parseFloat(this.mainBudget.valorTotal.toString()) + valorTotalLocal - this.currentValue).toFixed(2));
        
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.mainBudget.discount/100)).toFixed(2));
        this.pedraOption = false;
        console.log("MB VT: " + this.mainBudget.valorTotal);
        console.log(this.budgets[this.currentItem].valorUnitario);
        this.currentValue = this.mainBudget.valorTotal;
        this.clickRow(this.currentItem);
    }
    
    public setValue(){
        let valueCheckBox = Object.assign({}, this.orderForm.value);
        valueCheckBox = Object.assign(valueCheckBox, {
        checkBoxOption: valueCheckBox.checkBoxOption
            .map((v,i) => v ? this.checks[i] : null)
            .filter(v => v !== null)
    });
        this.comods = valueCheckBox.checkBoxOption;
        //console.log(this.orderForm.value.checkBoxOption);
        if(this.comods.length > 0){
            this.enableButton = true;
        }else{
            this.enableButton = false;
        }
    }
    
    clickRowChangeItem(description: string){
        this.descriptionChangeItem = description;
    }
    
    changeItemBudget(i: number){
        if(this.currentItem >=0){
            document.getElementById("openModalChangeItem").click();
        } else{
            alert("NÃO HÁ ITEM SELECIONADO");
        }
    }
    
    changeItem2(){
        this.budgets[this.currentItem].item = this.descriptionChangeItem;
    }
    
    addItemBudget(b: BudgetNew){
        this.budgets.push(b);
        this.mainBudget.valorTotal = this.mainBudget.valorTotal + this.appService.converteMoedaFloat(b.valorTotal);
        this.groupByAmbient();
    }
    
    applyDiscount(){
        this.discount = parseFloat(this.orderForm.get('txtDiscount').value);
        this.mainBudget.discount = this.discount;
        this.mainBudget.valorComDesconto = this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.discount/100);
        console.log(this.mainBudget.valorTotal);
        console.log(this.mainBudget.valorComDesconto);
    }

    joinBudget(){
        var self = this;
        var count = 0;
        var flag: boolean = false; 
        var keepGoing: boolean = true;
        var self = this;
        
        this.budgets.forEach(function(b){
            count = count + 1;
            if(self.budgetsAmbient.length > 0){
                self.budgetsAmbient.forEach(function(value){
                    console.log(self.budgetsAmbient.length);
                    if(keepGoing){
                        if(value.comodo === b.comodo){
                            flag = true;
                            value.qtd.push(b.qtd);
                            value.cod.push(b.cod);
                            value.item.push(b.item);
                            value.detalhe.push(b.detalhe);
                            value.medida.push(b.medida);
                            value.necessario.push(b.necessario);
                            value.valor.push(b.valorUnitario);
                            value.valorTotal.push(b.valorTotal);
                            value.valorTotalAmbiente = self.appService.converteMoedaFloat(value.valorTotalAmbiente) + self.appService.converteMoedaFloat(b.valorTotal);
                            keepGoing = false;
                            console.log(value.valorTotalAmbiente);
                        }
                    }
                }); 
            }
            if(!flag){
                self.newItem.comodo = b.comodo;
                self.newItem.qtd[0] = b.qtd;
                self.newItem.cod[0] = b.cod;
                self.newItem.item[0] = b.item;
                self.newItem.detalhe[0] = b.detalhe;
                self.newItem.medida[0] = b.medida;
                self.newItem.necessario[0] = b.necessario;
                self.newItem.valor[0] = b.valorUnitario;
                self.newItem.valorTotal[0] = b.valorTotal; 
                self.newItem.valorTotalAmbiente = b.valorTotal;
                self.budgetsAmbient.push(self.newItem);
                self.newItem = {comodo:"", qtd:[], cod:[], item:[], detalhe:[], medida:[], necessario:[], valor:[], valorTotal: [], valorTotalAmbiente: 0};
            }
            flag = false;
            keepGoing = true;
        });
        
        self.budgetsAmbient.forEach(function(data, index){
           if(data.qtd.length  == 1){
               self.budgetsAmbient[index].valorTotalAmbiente = self.appService.converteMoedaFloat(self.budgetsAmbient[index].valorTotalAmbiente);
           } 
        });

        console.log(this.budgetsAmbient);
    }
    
    transformBudgets(){
        var self = this;
        this.budgets.forEach(function(data){
            var b = {} as BudgetItem;
            b.qtd = data.qtd;
            b.cod = data.cod;
            b.item = data.item;
            b.detail = data.detalhe;
            b.measure = data.medida;
            b.ambient = data.comodo;
            b.necessary = data.necessario;
            b.unitValue = self.appService.converteMoedaFloat(data.valorUnitario).toString();
            b.totalValue = self.appService.converteMoedaFloat(data.valorTotal).toString();
            b.discount = self.discount.toString();
            b.discountValue = b.discountValue = ((parseFloat(b.totalValue) - (parseFloat(b.totalValue) * parseFloat(b.discount) / 100)).toFixed(2)); //modificar;
            b.budget = self.insertedBudget;
            b.number = 0;
            self.budgetItems.push(b);
        });
        
        console.log(self.budgetItems);
        self.params.query = self.convertToQuery(self.budgetItems);
        self.appService.postInsertBudgetItems(self.params).subscribe(function(value){
            console.log("DONE!");
            console.log(value);
        });
        
    }
    
    convertToQuery(budgetItems: BudgetItem[]): string{
        var response: string = "";
        budgetItems.forEach(function(data, index){
            if(index != 0){
                response = response + ",(" + data.budget + ",'" + data.qtd + "'," + data.cod + ",'" + data.item + "','" + data.detail + "','" + data.measure + "','" + data.ambient + "','" + data.necessary + "','" + data.unitValue + "','" + data.totalValue + "','" + data.discount + "','" + data.discountValue + "'," + data.number + ")";
            } else{
                response = response + "(" + data.budget + ",'" + data.qtd + "'," + data.cod + ",'" + data.item + "','" + data.detail + "','" + data.measure + "','" + data.ambient + "','" + data.necessary + "','" + data.unitValue + "','" + data.totalValue + "','" + data.discount + "','" + data.discountValue + "'," + data.number + ")";
            }
        });
        return response;
    }
    
    getBudgets(): BudgetNew[]{
        return this.budgets;
    }
    
    buildComodos(){
        const values = this.checks.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    groupByAmbient(){
        var self = this;
        self.budgetsAux = [];
        var verifiedItems: number[] = [];

        self.checks.forEach(function(value){

            var b = {} as BudgetNew;
            b.item = "LINHA DE SEPARAÇÃO";
            b.comodo = value;
            self.budgetsAux.push(b);
            
            self.budgets.forEach(function(data, index){
                if(data.comodo == value && verifiedItems.indexOf(index) == -1 && data.item != "LINHA DE SEPARAÇÃO"){
                    self.budgetsAux.push(data);
                    verifiedItems.push(index);
                }
            })
            
        });
        self.budgets = self.budgetsAux;
        self.budgetsAux = [];
        console.log(self.budgets);
    }
    
    
    setBudgetInsertion(){    
        this.bInsertion.aprovado = false;
        this.bInsertion.caminho = "";
        this.bInsertion.data = this.formin.date;
        this.bInsertion.desconto = this.discount;
        this.bInsertion.observacao = this.orderForm.get('txtObservacao').value;
        this.bInsertion.retificado = 1;
        this.bInsertion.tipoCliente = this.formin.type; //MODIFICAR
        this.bInsertion.valorTotal = this.mainBudget.valorTotal;
        this.bInsertion.arquiteto_id = null;
        this.bInsertion.poload = this.formin.poload;
        if(this.formin.type == 'LOJ'){
            this.bInsertion.clienteEmpresa_id = this.client.id_Client;
            this.bInsertion.pessoa_id = null;//this.clienteEmpresa_id;
        } else{
            this.bInsertion.clienteEmpresa_id = null; //this.clienteEmpresa_id;
        }
        this.bInsertion.clienteEmpresaa_id = this.thirdy.id_Thirdy; //this.clienteEmpresaa_id;
        if(this.formin.type == 'FIS'){
            this.bInsertion.pessoa_id = this.client.id_Client; //this.pessoa_id;
        } else{
            this.bInsertion.pessoa_id = null;
        }
        if(this.formin.type == 'LOJ'){
            this.bInsertion.vendedor_id = this.client.id_vendor;//this.vendedor_id;
        } else{
            this.bInsertion.vendedor_id = null;
        }
    }
    
    convertBudgetToString(): Promise<any>{
        var self = this;
        
        return new Promise(function(resolve, reject){
            var params = {query: self.convertBInsertionToString()};
            self.appService.postBudgetInsertionTest(params).subscribe(function(data){
            //self.appService.budgetInsertionTest(self.convertBInsertionToString()).subscribe(function(data){
            self.insertedBudget = data['insertId'];
        
            self.budgets.forEach(function(data){
                console.log(data.qtd);
                self.qtds.push(data.qtd);
                self.cods.push(data.cod);
                self.itemss.push(data.item);
                self.detalhes.push(data.detalhe);
                self.medidas.push(data.medida);
                self.comodos.push(data.comodo);
                self.necessarios.push(data.necessario);
                self.valoresUnitarios.push(self.appService.converteMoedaFloat(data.valorUnitario));
                self.valoresTotais.push(self.appService.converteMoedaFloat(data.valorTotal));
                self.descontos.push(data.desconto);
                self.valoresComDesconto.push(data.valorComDesconto);
            });
        
            self.fillStringToQuery(self.qtds, self.qtdsString, self.insertedBudget)
                .then(function(response){
                        self.qtdsString = response;
                });
            self.fillStringToQuery(self.cods, self.codsString, self.insertedBudget)
                .then(function(response){
                        self.codsString = response;
                });
            self.fillStringToQuery(self.itemss, self.itemsString, self.insertedBudget)
                .then(function(response){
                        self.itemsString = response;
                });
            self.fillStringToQuery(self.detalhes, self.detalhesString, self.insertedBudget)
                .then(function(response){
                        self.detalhesString = self.appService.replaceAll(response, String.fromCharCode(10), "QUEBRADELINHA");
                });
            self.fillStringToQuery(self.medidas, self.medidasString, self.insertedBudget)
                .then(function(response){
                        self.medidasString = response;
                });
            self.fillStringToQuery(self.comodos, self.comodosString, self.insertedBudget)
                .then(function(response){
                        self.comodosString = response;
                });
            self.fillStringToQuery(self.necessarios, self.qtdsString, self.insertedBudget)
                .then(function(response){
                        self.necessariosString = response;
                });
            self.fillStringToQuery(self.valoresUnitarios, self.valoresUnitariosString, self.insertedBudget)
                .then(function(response){
                        self.valoresUnitariosString = response;
                });
            self.fillStringToQuery(self.valoresTotais, self.valoresTotaisString, self.insertedBudget)
                .then(function(response){
                        self.valoresTotaisString = response;
                });
            self.fillStringToQuery(self.descontos, self.descontosString, self.insertedBudget)
                .then(function(response){
                        self.descontosString = response;
                });
            self.fillStringToQuery(self.valoresComDesconto, self.valoresComDescontoString, self.insertedBudget)
                .then(function(response){
                        self.valoresComDescontoString = response;
                });
                resolve("convertBudgetToString executado com sucesso!!");
            });
        });
    }
    
    convertBInsertionToString(): string{
        
        var aprovado: number = 0;
        var caminho: string = "0";
        var observacao: string = "0";
        var retificado: number = 1;
        var tipoCliente: string;
        var data: string;
        var poload = 0;
        
        data = this.bInsertion.data;
       //data
        
        if(this.bInsertion.aprovado){
            aprovado = 1;
        } 
        if(this.bInsertion.caminho != ""){
           caminho = this.bInsertion.caminho;
        }
        if(this.bInsertion.observacao != ""){
           observacao = "'" + this.appService.replaceAll(this.bInsertion.observacao, String.fromCharCode(10), "QUEBRADELINHA") + "'";
        }
        if(this.bInsertion.retificado != 1){
           retificado = this.bInsertion.retificado;
        }
        if(this.bInsertion.tipoCliente == "LOJ"){
           tipoCliente = "Empresa";
        } else{
            tipoCliente = "Físico";
        }
        if(this.bInsertion.poload){
            poload = 1;
        }else{
            poload = 0;
        }
        
        console.log(this.bInsertion.valorTotal);
        return "(" + aprovado + "," +
                    "'" + caminho + "'" + "," +
                    "'" + data + "'" + "," +
                    this.bInsertion.desconto + "," +
                    observacao + "," +
                    retificado + "," +
                    "'" + tipoCliente + "'" + "," +
                    this.bInsertion.valorTotal + "," +
                    this.bInsertion.arquiteto_id + "," +
                    this.bInsertion.clienteEmpresa_id + "," +
                    this.bInsertion.clienteEmpresaa_id + "," +
                    null + "," +
                    this.bInsertion.pessoa_id + "," +
                    this.bInsertion.vendedor_id + "," +
                    poload + ")";
    }
    
    removeSeparationRows(){
        var self = this;
        var budgetsAux: BudgetNew[] = []
        this.budgets.forEach(function(data, index){
           if(data.item != "LINHA DE SEPARAÇÃO"){
                    budgetsAux.push(data);
                }
        });
        this.budgets = budgetsAux;
        console.log(this.budgets);
    }
    
    budgetInsertionTest(){
        var budgetId: number = 5;
        var codes: number[] = [100,200,300];
        var ambients: string[] = ['a','b','c'];
        var queryCodes = "";
        var queryAmbients = "";
        var response: any;
        var self = this;
        this.removeSeparationRows();
        
        this.spinner.show();
        self.joinBudget();
        self.setBudgetInsertion();
        console.log(self.bInsertion);
        
        
        this.convertBudgetToString().then(function(data){
            console.log(self.convertBInsertionToString());
            //self.convertBudgetToString();
            var param = {budgetQuantitys: self.qtdsString, budgetAmbients: self.comodosString, budgetCodes: self.codsString, budgetDetails: self.detalhesString, budgetItems: self.itemsString, budgetMeasures: self.medidasString, budgetValues: self.valoresUnitariosString, budgetNeedings: self.necessariosString};
            self.appService.postBudgetInsertion(param).subscribe(function(response){
            //self.appService.budgetInsertion(self.codsString, self.comodosString, self.detalhesString, self.itemsString, self.medidasString, self.necessariosString, "(1,'0')", self.qtdsString, self.valoresUnitariosString, self.convertBInsertionToString()).subscribe(function(response){
                console.log(response);
            });
            self.test();
            console.log(data);
            self.spinner.hide();
            self.route.navigate(['budget']);
            self.budgetEdited = true;
            self.transformBudgets();
            alert("ORÇAMENTO "+ self.insertedBudget +" PROCESSADO ");
        });
    }
    
    checkBInsertion(){
        this.test();
        this.setBudgetInsertion();
        console.log(this.bInsertion);
    }
    
    fillStringToQuery(list: any[], response: any, id: any): Promise<any>{
        return new Promise(function (resolve, reject) {
            list.forEach(function(data, index){
                if(index == 0){
                    response = response + id + ',' + "'" + data + "')";
                } else{
                    response = response + ",(" + id + ',' + "'" + data + "')";
                }
            });
            console.log(response);
            resolve(response);   
        });
    }
    
    applyFreight(){
        this.mainBudget.freight = parseFloat(this.orderForm.get('txtFreight').value);
        
        console.log(this.mainBudget.freight);
    }
    
  ngOnInit() {
      var self = this;
      this.start.start();
      
      setTimeout(() => this.spinner.show(), 10);
      this.orderForm = this.formBuilder.group({
            inputPlace: this.formBuilder.control(''),
            txtQtd: this.formBuilder.control(''),
            txtNecessario: this.formBuilder.control(''),
            txtMedida: this.formBuilder.control(''),
            txtValor: this.formBuilder.control('', [Validators.required]),
            txtMedida1: this.formBuilder.control(''),
            txtMedida2: this.formBuilder.control(''),
            txtDetalhe: this.formBuilder.control(''),
            txtObservacao: this.formBuilder.control(''),
            txtDiscount: this.formBuilder.control(''),
            checkBoxOption: this.buildComodos(),
            txtFrete: this.formBuilder.control(''),
            txtFormaPagamento: this.formBuilder.control(''),
            txtFreight: this.formBuilder.control('')
      })
      
      this.modalForm = this.formBuilder.group({
            qtdSubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            unidadeSubItem: this.formBuilder.control('', [Validators.required]),
            medida1SubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            medida2SubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            descricaoSubItem: this.formBuilder.control('', [Validators.required])
      })
      
      this.orderForm.get('txtObservacao').setValue("ORÇAMENTO SUJEITO A ALTERAÇÃO DE VALOR APÓS MEDIÇÃO E CONFERÊNCIA DO PROJETO EM LOCO" + String.fromCharCode(10) +"ORÇAMENTO VÁLIDO POR 10 DIAS"+ String.fromCharCode(10) +"CUBAS DE LOUÇA E INOX NÃO INCLUSAS NO ORÇAMENTO"+ String.fromCharCode(10) + "DESCONTO NÃO APLICÁVEL SOBRE O FRETE" + String.fromCharCode(10) + String.fromCharCode(10) + "PAGAMENTO A VISTA COM 5% DE DESCONTO, SENDO 70% NO ATO E 30% NA ENTREGA" + String.fromCharCode(10) + "FORMA DE PAGAMENTO: ");
      this.cbo = (this.orderForm.get('checkBoxOption') as FormArray);
      
      this.router.queryParams.subscribe(
        (queryParams: any) =>{
            this.formin = queryParams;
            console.log(this.formin);
        }
      );
      
      this.appService.budgetItems().subscribe(function(budgetItems){
          self.items = budgetItems;
          
      });
      
      /*this.appService.thirdyBudget("'" + this.formin.client + "'", "'" + this.formin.thirdy + "'").subscribe(function(thirdyBudget){
          self.thirdyDataObj = thirdyBudget;
          console.log(self.thirdyDataObj[0]);
      });*/
      
      this.appService.clientBudget("'" + this.formin.client + "'", "'" + this.formin.vendor + "'").subscribe(function(clientBudget){
        self.appService.thirdyBudget("'" + self.formin.client + "'", "'" + self.formin.thirdy + "'").subscribe(function(thirdyBudget){
              self.thirdyDataObj = thirdyBudget;
                self.thirdyCnpj = thirdyBudget[0]['thirdyCnpj'];
                self.thirdyCpf = thirdyBudget[0]['thirdyCpf'];
            self.setCpf();
              console.log(self.thirdyDataObj[0]);
              self.clientDataObj = clientBudget;
              console.log(self.clientDataObj);
              console.log(self.thirdyDataObj);
              console.log(self.clientDataObj[0]);
              self.setData();
              self.setClient();
              self.setThirdy();
              self.setMainBudget();
              self.setBudgetInsertion();
              console.log(self.client);
              console.log(self.thirdy);
              console.log(self.bInsertion);
              console.log(self.clientData);
              console.log(self.clientDataObj[0]);
            self.showSpinner(false);
              self.loadPage = true;
        });
      });
  }
}