import { Component, OnInit, Input, Directive, HostListener, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {AppService} from "../../app.service";
import {BudgetNew} from "../budget-new/budget-new.model";
import {StartService} from '../../start.service';
import {CheckBox} from '../../shared/check/check-box.model';
import {KEY_CODE} from '../../shared/key-code/keyCode';
import { ActivatedRoute, Router } from '@angular/router';
import {BudgetModel} from '../budget.model'
import {CreatePdfComponent} from '../../create-pdf/create-pdf.component'
import "rxjs/add/operator/map";
import {BudgetAmbient} from "../budget-new/budget-ambient.model";
import { NgControl } from '@angular/forms';
import {Client} from '../../clients/client.model';
import {Terceiro} from '../../clients/terceiro.model';
import {BudgetInsertion} from '../budget-insertion.model';
import {Observable} from "rxjs/Observable";
import {SubItem} from "../budget-new/sub-item.model";
import {NgxSpinnerService} from 'ngx-spinner';
import {BudgetNewComponent} from '../budget-new/budget-new.component';
import {BudgetService} from '../budget.service'
import {formin} from '../../service-order/forminSO';
import {ParameterService} from '../../shared/parameter.service';
import {BudgetItem} from '../budget-item.model';

@Component({
  selector: 'sivp-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.css']
})
export class BudgetEditComponent implements OnInit {

constructor(private formBuilder: FormBuilder, private appService: AppService, private start: StartService, private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService, private budgetService: BudgetService, private parameterService: ParameterService) { }
    
      @HostListener('window:keyup', ['$event'])
      keyEvent(event: KeyboardEvent) {
        console.log(event);

        if (event.keyCode === KEY_CODE.DELETE) {
          //this.removeItem();
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
    
    nameClient: string;
    nameThirdy: string;
    nameVendor: string;
    typeClient: string;
    numberValidator = /^[\d,.?!]+$/;
    subItems: SubItem[] = [];
    loadPage: boolean = false;
    orderForm: FormGroup;
    modalForm: FormGroup;
    mainBudget = {} as BudgetModel;
    //formout = {budgetId: 0, store: "", thirdy: "", seller: "", date: "", budgets: []};
    formout = {} as formin;
    insertedBudget: any;
    budgetItems: BudgetItem[] = [];
    newBudgetItems: BudgetItem[] = [];
    removeItems: number[] = []
    params = {query: ""};
    insertedItem: number = -1000;
    
    b: BudgetNew = {
        qtd: 0,
        cod: "",
        item: "",
        detalhe: "",
        medida: "",
        comodo: "",
        necessario: "",
        valorUnitario: null,
        valorTotal: null,
        desconto: 0,
        valorComDesconto:0
    }
    
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
    
    setClient(type: string, name: string, tel: string, cel: string, email: string, address: string, id_Client: number, id_Thirdy: number, id_vendor: number){
        this.client = {
                           type: type,
                           name: name,
                           tel: tel,
                           cel: cel,
                           email: email,
                           address:  address,
                           id_Client: id_Client,
                           id_Thirdy: id_Thirdy,
                           id_vendor: id_vendor
                        };
    }
    
    setThirdy(name: string, tel: string, cel: string, email: string, address: string, id_Thirdy: number){
        this.thirdy = { name: name,
                        tel: tel,
                        cel: cel,
                        email: email,
                        address: address,
                        id_Thirdy: id_Thirdy
                      };
    }
    
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
        vendedor_id: 0//this.vendedor_id;
    };
    
    self = this;
    idInput: number;
    loadItems: boolean = false;
    items: Object[];
    cmds: string[] = [];
    formin= {type: "", client: "", vendor: "", thirdy: "", date: ""};
    budgets: BudgetNew[] = [];
    returnedData: Object[];
    places: string[] = [];
    checks: string[] = [];
    currentValue: number;
    approved: boolean;
    
    cmd = [{comodos: ""}];
    qtd = [{quantidades: ""}];
    cod = [{codigos: ""}];
    ite = [{itens: ""}];
    det = [{detalhes: ""}];
    med = [{medidas: ""}];
    nec = [{necessidades: ""}];
    val = [{valores: ""}];
    orc = [{aprovado: "", arquiteto_id: null, caminho:"", clienteEmpresa_id: null, clienteEmpresaa_id: null, clienteJuridico_id: null, data: "", desconto: null, id:null, observacao:"", pessoa_id: null, retificado: null, tipoCliente: "", valorTotal: null, vendedor_id: null, nome: ""}];
    jur = [{DTYPE: "", bairro: "", celular: "", celular2: "", cidade: "", cnpj: "", complemento: "", cpf: null, endereco: "", enderecoObra: "", id: null, nome: "", telefone: "", telefone2: "", email: ""}];
    pes = [{DTYPE: "", bairro: "", celular: "", celular2: "", cidade: "", cnpj: "", complemento: "", cpf: null, endereco: "", enderecoObra: "", id: null, nome: "", telefone: "", telefone2: "", email: ""}];
    ter = [{bairro: "", celular: "", celular2: "", cidade: "", complemento: "", email: "", empresa_id: null, endereco: "", id: null, nome: "", telefone:"", telefone2: ""}];
    ven = [{celular: "", celular2: "", email: "", empresa_id: null, id: null, nome: "", telefone: "", telefone2: ""}];
    
    
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
        
        this.budgets[this.currentItem].qtd = parseFloat((this.budgets[this.currentItem].qtd + (this.modalForm.get('medida1SubItem').value * this.modalForm.get('medida2SubItem').value * this.modalForm.get('qtdSubItem').value)/10000).toFixed(2));
        
        this.budgets[this.currentItem].detalhe = this.budgets[this.currentItem].detalhe + "\n*" +  this.modalForm.get('qtdSubItem').value + " " + this.modalForm.get('unidadeSubItem').value + " " + this.modalForm.get('medida1SubItem').value + "x" + this.modalForm.get('medida2SubItem').value + " " + this.modalForm.get('descricaoSubItem').value;
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
        
        this.mainBudget.valorTotal = parseFloat(this.mainBudget.valorTotal.toString()) + valorTotalLocal - this.currentValue;
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.mainBudget.discount/100)).toFixed(2));
        
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal);
        console.log(this.currentValue);
        
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
        
        //this.changeItem();
    }
    
    setValueCheckBox(i: number){
            this.orderForm.value.checkBoxOption[i] = !this.orderForm.value.checkBoxOption[i];
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
    
    changeCurrentValue(){
        console.log("changeCurrentValue()")
        this.currentValue = this.orderForm.get('txtValor').value;    
    }
    
    changeItem(){
        console.log(this.budgets);
        console.log(this.currentItem);
        var qtd: number = parseFloat(this.orderForm.get('txtQtd').value.toString().replace(',','.'));
        var valor: number = parseFloat(this.orderForm.get('txtValor').value.toString().replace(',','.'));
        var medida1: number = parseFloat(this.orderForm.get('txtMedida1').value);
        var medida2: number = parseFloat(this.orderForm.get('txtMedida2').value);
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
        
        
        
        //------------------------------------- NEW BUDGET ITEMS -------------------------------------------//
        this.budgetItems[this.currentItem].qtd = this.orderForm.get('txtQtd').value;
        this.budgetItems[this.currentItem].necessary = this.orderForm.get('txtNecessario').value;
        this.budgetItems[this.currentItem].detail = this.orderForm.get('txtDetalhe').value;
        //this.budgetItems[this.currentItem].unitValue = this.appService.converteFloatMoeda(this.orderForm.get('txtValor').value);
        this.budgetItems[this.currentItem].unitValue = this.orderForm.get('txtValor').value;
        
        if(this.pedraOption){
            this.budgetItems[this.currentItem].totalValue = ((medida1 * medida2 * valor)/ 10000).toString(); 
            this.budgetItems[this.currentItem].measure = this.orderForm.get('txtMedida1').value + " x " + this.orderForm.get('txtMedida2').value;
        } else{
            //this.budgetItems[this.currentItem].totalValue = this.appService.converteFloatMoeda(parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgetItems[this.currentItem].unitValue)).toFixed(2)));
            this.budgetItems[this.currentItem].totalValue = parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgetItems[this.currentItem].unitValue)).toFixed(2)).toString();
            this.budgetItems[this.currentItem].measure = this.orderForm.get('txtMedida').value;
        }
        //------------------------------------- END NEW BUDGET ITEMS -------------------------------------------//
        console.log(this.budgetItems[this.currentItem]);
    }
    
    createNewPdf(){
    
        this.joinBudget();
        this.testGenerate();
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
        var self = this;
        var response: string = "";
        budgetItems.forEach(function(data, index){
            if(index != 0){
                response = response + ",(" + self.idInput + ",'" + data.qtd + "'," + data.cod + ",'" + data.item + "','" + data.detail + "','" + data.measure + "','" + data.ambient + "','" + data.necessary + "','" + data.unitValue + "','" + data.totalValue + "','" + data.discount + "','" + data.discountValue + "'," + data.number + ")";
            } else{
                response = response + "(" + self.idInput + ",'" + data.qtd + "'," + data.cod + ",'" + data.item + "','" + data.detail + "','" + data.measure + "','" + data.ambient + "','" + data.necessary + "','" + data.unitValue + "','" + data.totalValue + "','" + data.discount + "','" + data.discountValue + "'," + data.number + ")";
            }
        });
        return response;
    }
    
    joinBudget(){
        var self = this;
        var count = 0;
        var flag: boolean = false; 
        var keepGoing: boolean = true;
        var self = this;
        var valorAmbienteLocal: number;
        var valorTotalLocal: number;
        
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
                            //value.valorTotalAmbiente = self.appService.converteMoedaFloat(value.valorTotalAmbiente) + self.appService.converteMoedaFloat(b.valorTotal);
                            
                            if(isNaN(value.valorTotalAmbiente)){
                               valorAmbienteLocal = parseFloat(self.appService.converteMoedaFloat(value.valorTotalAmbiente).toFixed(2));
                            } else{
                                valorAmbienteLocal = parseFloat(value.valorTotalAmbiente.toFixed(2));
                            }
                            
                            if(isNaN(b.valorTotal)){
                               valorTotalLocal = parseFloat(self.appService.converteMoedaFloat(b.valorTotal).toFixed(2));
                            } else{
                                valorTotalLocal = parseFloat(b.valorTotal.toFixed(2));
                            }
                            
                            value.valorTotalAmbiente = valorAmbienteLocal + valorTotalLocal;
                            keepGoing = false;
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
    
    
    public clickRow(i: number){
        
        console.log("clickRow Edit");
        this.currentItem = i;
        setTimeout(()=>{
            this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        }, 10);
        console.log(this.budgets[this.currentItem].valorUnitario);
        console.log(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario);
        console.log(this.currentValue);
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtNecessario').setValue(this.budgets[this.currentItem].necessario);
        this.orderForm.get('txtMedida').setValue(this.budgets[this.currentItem].medida);
        this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
    }
    
    editBudget(){
        var self = this;
        this.spinner.show();
        this.appService.budgetItems().subscribe(function(budgetItems){
            self.items = budgetItems;
            self.loadItems = true;
            self.spinner.hide();
      });
    }
    
    applyDiscount(){
        var self = this;
        this.discount = parseFloat(this.orderForm.get('txtDiscount').value);
        this.mainBudget.discount = this.discount;
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.discount/100)).toFixed(2));
        this.budgetItems.forEach(function(data){
            data.discount = self.orderForm.get('txtDiscount').value
        })
        console.log(this.mainBudget.valorTotal);
        console.log(this.mainBudget.valorComDesconto);
    }
    
    buildComodos(){
        const values = this.checks.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    addItem(b: BudgetNew){
        console.log("AddItem");
        this.budgets.push(b);
    }
    
    addItemBudget(b: BudgetNew){
        console.log("AddItemBudget");
        var self = this;
        this.budgets.push(b);
        
        var bi = {} as BudgetItem;
            bi.id = this.insertedItem;
            bi.qtd = b.qtd;
            bi.cod = b.cod;
            bi.item = b.item;
            bi.detail = b.detalhe;
            bi.measure = b.medida;
            bi.ambient = b.comodo;
            bi.necessary = b.necessario;
            bi.unitValue = self.appService.converteMoedaFloat(b.valorUnitario).toString();
            bi.totalValue = self.appService.converteMoedaFloat(b.valorTotal).toString();
            bi.discount = this.mainBudget.discount.toString();
            bi.discountValue = ((parseFloat(bi.totalValue) - (parseFloat(bi.totalValue) * parseFloat(bi.discount) / 100)).toFixed(2)); //modificar;
            bi.budget = self.idInput;
            bi.number = 0;
            self.budgetItems.push(bi);
        
        this.insertedItem = this.insertedItem + 1;
        this.mainBudget.valorTotal = this.mainBudget.valorTotal + this.appService.converteMoedaFloat(b.valorTotal);
        this.mainBudget.valorComDesconto = parseFloat((this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.mainBudget.discount/100)).toFixed(2));
        //this.applyDiscount();
    }
    
    convertDuplicateBudgetToString(): Promise<any>{
        var self = this;
        
        return new Promise(function(resolve, reject){
            self.appService.budgetInsertionTest(self.convertBInsertionToString()).subscribe(function(data){
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
                        self.detalhesString = response;
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
    
    convertBudgetToString(): Promise<any>{
        var self = this;
        
        return new Promise(function(resolve, reject){
        
            self.budgets.forEach(function(data){
                console.log(data.valorUnitario);
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
        
            self.fillStringToQuery(self.qtds, self.qtdsString, self.mainBudget.number)
                .then(function(response){
                        self.qtdsString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.cods, self.codsString, self.mainBudget.number)
                .then(function(response){
                        self.codsString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.itemss, self.itemsString, self.mainBudget.number)
                .then(function(response){
                        self.itemsString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.detalhes, self.detalhesString, self.mainBudget.number)
                .then(function(response){
                        self.detalhesString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.medidas, self.medidasString, self.mainBudget.number)
                .then(function(response){
                        self.medidasString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.comodos, self.comodosString, self.mainBudget.number)
                .then(function(response){
                        self.comodosString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.necessarios, self.qtdsString, self.mainBudget.number)
                .then(function(response){
                        self.necessariosString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.valoresUnitarios, self.valoresUnitariosString, self.mainBudget.number)
                .then(function(response){
                        self.valoresUnitariosString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.valoresTotais, self.valoresTotaisString, self.mainBudget.number)
                .then(function(response){
                        self.valoresTotaisString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.descontos, self.descontosString, self.mainBudget.number)
                .then(function(response){
                        self.descontosString = response.replace(/[\/]/g,'%2F');
                });
            self.fillStringToQuery(self.valoresComDesconto, self.valoresComDescontoString, self.mainBudget.number)
                .then(function(response){
                        self.valoresComDescontoString = response.replace(/[\/]/g,'%2F');
                });
                resolve("convertBudgetToString executado com sucesso!!");
        });
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
    
    // REMOVER UM ITEM DO ARRAY
    //this.places = this.places.slice(0,i).concat(this.places.slice(i+1,this.places.length));
    
    onKeydown(event){
        alert("APERTOU DELETE");
    }
    
    removeItem(i: number){
        //var i: number;
        //i = this.currentItem;
        
        //this.mainBudget.valorTotal = parseFloat((this.mainBudget.valorTotal - this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal)).toFixed(2));
        console.log(this.currentItem);
        console.log(this.budgetItems);
        if(this.currentItem >=0){
            this.mainBudget.valorTotal = parseFloat((this.mainBudget.valorTotal - this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal)).toFixed(2));
            this.budgets = this.budgets.slice(0,i).concat(this.budgets.slice(i+1,this.budgets.length));
            
            if(this.budgetItems[this.currentItem].id > 0){
                this.removeItems.push(this.budgetItems[this.currentItem].id);
                this.budgetItems.splice(this.budgetItems.indexOf(this.budgetItems.find(v => v['id'] == this.budgetItems[this.currentItem]['id'])), 1);
            }
            
        } else{
            alert("NÃO HÁ ITEM SELECIONADO");
        }
    }
    
    retifyBudget(){
        var self = this;
        this.spinner.show();
        this.convertBudgetToString().then(function(data){
           self.removeBarURL();
            console.log(self.itemsString);
        var params = {budgetId: self.mainBudget.number, discount: self.mainBudget.discount, note: self.mainBudget.note, rectified: self.mainBudget.rectified, amount: self.mainBudget.valorTotal, budgetCodes: self.codsString, budgetAmbients: self.comodosString, budgetDetails: self.detalhesString, budgetItems: self.itemsString, budgetMeasures: self.medidasString, budgetNeedings: self.necessariosString, budgetNumbers: "(1,'0')", budgetQuantitys: self.qtdsString, budgetValues: self.valoresUnitariosString}  
        console.log(params);
           //self.appService.budgetUpdate(self.mainBudget.number, self.mainBudget.discount, self.mainBudget.note, self.mainBudget.rectified, self.mainBudget.valorTotal, self.codsString, self.comodosString, self.detalhesString, self.itemsString, self.medidasString, self.necessariosString, "(1,'0')", self.qtdsString, self.valoresUnitariosString).subscribe(function(value){
        self.appService.postBudgetUpdate(params).subscribe(function(value){
               self.joinBudget();
               self.createPdf.gerarPDF(self.budgetsAmbient, self.mainBudget);
               console.log(value);
               self.spinner.hide();
               self.router.navigate(['budget']);
               self.updateBudgetItems();
               alert("ORÇAMENTO " + self.mainBudget.number + " RETIFICADO");
           });
        });
    }
    
    updateBudgetItems(){
        var self = this;
        var oldBudgetItems: BudgetItem[] = [];
        var newBudgetItems: BudgetItem[] = [];
        var remove: string = "";
        
        
        if(this.removeItems.length > 0){
            this.removeItems.forEach(function(data, index){
                
                //self.budgetItems.splice(self.budgetItems.indexOf(self.budgetItems.find(v => v['id'] == data)), 1);
                
                if(index != 0){
                    remove = remove + "," + data;
                }else{
                    remove = remove + data;
                }
            });
            
            console.log(self.budgetItems);
            
            console.log(remove);
            this.appService.deleteBudgetItem(remove).subscribe(function(data){
                console.log(data);
                console.log("Itens Excluídos");
                
                
                
                
                self.budgetItems.forEach(function(data){
                    if(data.id > 0){
                        oldBudgetItems.push(data);
                    } else{
                        newBudgetItems.push(data);
                    }
                });
        
                if(oldBudgetItems.length > 0){
                    console.log("OLD BUDGET");
                    oldBudgetItems.forEach(function(data){
                        console.log(data);
                        self.appService.postUpdateBudgetItem(data).subscribe(function(value){
                            console.log(value); 
                        });
                    });
                }
        
                if(newBudgetItems.length > 0){
                    console.log("NEW BUDGET")
                    var params = {query: self.convertToQuery(newBudgetItems)};
                    self.appService.postInsertBudgetItems(params).subscribe(function(data){
                        console.log(data);
                    });
                }
                
                console.log(newBudgetItems);
                console.log(oldBudgetItems);
            });
        } else{
            self.budgetItems.forEach(function(data){
                    if(data.id > 0){
                        oldBudgetItems.push(data);
                    } else{
                        newBudgetItems.push(data);
                    }
                });
        
                if(oldBudgetItems.length > 0){
                    console.log("OLD BUDGET");
                    oldBudgetItems.forEach(function(data){
                        console.log(data);
                        self.appService.postUpdateBudgetItem(data).subscribe(function(value){
                            console.log(value); 
                        });
                    });
                }
        
                if(newBudgetItems.length > 0){
                    console.log("NEW BUDGET")
                    var params = {query: this.convertToQuery(newBudgetItems)};
                    self.appService.postInsertBudgetItems(params).subscribe(function(data){
                        console.log(data);
                    });
                }

        }
        
    }
    
    
    
    budgetInsertionTest(){
        var budgetId: number = 5;
        var codes: number[] = [100,200,300];
        var ambients: string[] = ['a','b','c'];
        var queryCodes = "";
        var queryAmbients = "";
        var response: any;
        var self = this;
        
        this.spinner.show();
        self.joinBudget();
        self.setBudgetInsertion();
        console.log(self.bInsertion);
        
        this.convertDuplicateBudgetToString().then(function(data){

            

            console.log(self.convertBInsertionToString());
            self.appService.budgetInsertion(self.codsString, self.comodosString, self.detalhesString, self.itemsString, self.medidasString, self.necessariosString, "(1,'0')", self.qtdsString, self.valoresUnitariosString, self.convertBInsertionToString()).subscribe(function(response){
                console.log(response);
            });
            self.test();
            console.log(data);
            self.spinner.hide();
            self.router.navigate(['budget']);
            alert("ORÇAMENTO "+ self.insertedBudget +" PROCESSADO ");
        });
    }
    
    testGenerate(){
        this.mainBudget.number = this.idInput;
        //this.joinBudget();
        
        this.createPdf.gerarPDF(this.budgetsAmbient, this.mainBudget);
    }
    
    test(){
        this.mainBudget.number = this.insertedBudget;
        this.mainBudget.note = this.orderForm.get('txtObservacao').value;        
        this.createPdf.gerarPDF(this.budgetsAmbient, this.mainBudget);
    }
    
    setBudgetInsertion(){    
        this.bInsertion.aprovado = false;
        this.bInsertion.caminho = "";
        this.bInsertion.data = this.formin.date;
        this.bInsertion.desconto = this.discount;
        this.bInsertion.observacao = "";
        this.bInsertion.retificado = 1;
        this.bInsertion.tipoCliente = this.formin.type; //MODIFICAR
        this.bInsertion.valorTotal = this.mainBudget.valorTotal;
        this.bInsertion.arquiteto_id = null;
        if(this.formin.type == 'LOJ'){
            console.log("ENTROU EM LOJ")
            this.bInsertion.clienteEmpresa_id = this.client.id_Client;
            this.bInsertion.pessoa_id = null;//this.clienteEmpresa_id;
        } else{
            console.log("ENTROU EM ELSE")
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
    
    convertBInsertionToString(): string{
        
        var aprovado: number = 0;
        var caminho: string = "0";
        var observacao: string = "0";
        var retificado: number = 1;
        var tipoCliente: string;
        var data: string;
        
        data = this.bInsertion.data.replace('/','%2F');
        data = data.replace('/','%2F');
        
        if(this.bInsertion.aprovado){
            aprovado = 1;
        } 
        if(this.bInsertion.caminho != ""){
           caminho = this.bInsertion.caminho;
        }
        if(this.bInsertion.observacao != ""){
           observacao = this.bInsertion.observacao;
        }
        if(this.bInsertion.retificado != 1){
           retificado = this.bInsertion.retificado;
        }
        if(this.bInsertion.tipoCliente == "LOJ"){
           tipoCliente = "Empresa";
        } else{
            tipoCliente = "Físico";
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
                    this.bInsertion.vendedor_id + ")"
    }
    
    
    
    removeBarURL(){
        var self = this;
        if(self.mainBudget.note){
            self.mainBudget.note = self.mainBudget.note.replace(/[\/]/g,'%2F');
        }
        
        if(self.codsString){
            self.codsString = self.codsString.replace(/[\/]/g,'%2F');
        }
        
        if(self.comodosString){
            self.comodosString = self.comodosString.replace(/[\/]/g,'%2F');
        }
        
        if(self.detalhesString){
            self.detalhesString = self.detalhesString.replace(/[\/]/g,'%2F');
        }
        
        if(self.itemsString){
            self.itemsString = self.itemsString.replace(/[\/]/g,'%2F');
        }
        
        if(self.medidasString){
            self.medidasString = self.medidasString.replace(/[\/]/g,'%2F');
        }
        
        if(self.necessariosString){
            self.necessariosString = self.necessariosString.replace(/[\/]/g,'%2F');
        }
        
        if(self.qtdsString){
            self.qtdsString = self.qtdsString.replace(/[\/]/g,'%2F');
        }
        
        if(self.valoresUnitariosString){
            self.valoresUnitariosString = self.valoresUnitariosString.replace(/[\/]/g,'%2F');
        }
    }
    
    getBudgets(): BudgetNew[]{
        let auxBudgets: BudgetNew[] = this.budgets;
        return auxBudgets;
    }
    
    changeBudgetStatus(status: boolean){
        this.spinner.show();
        var self = this;
        this.appService.editBudgetStatus(this.idInput, status).subscribe(function(data){
            self.approved = status;
            if(status){
                alert("Orçamento aprovado");
            }else{
                alert("Orçamento Rejeitado");
            }
            self.spinner.hide();
        });
    }
    
  ngOnInit() {
      
      var self = this;
      self.formin.type = "LOJ";
      var valorTotalLocal: number;
      setTimeout(() => {this.spinner.show()}, 10);
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
            checkBoxOption: this.buildComodos()
      })
      
      this.modalForm = this.formBuilder.group({
            qtdSubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            unidadeSubItem: this.formBuilder.control('', [Validators.required]),
            medida1SubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            medida2SubItem: this.formBuilder.control('', [Validators.required, Validators.pattern(self.numberValidator)]),
            descricaoSubItem: this.formBuilder.control('', [Validators.required])
      })

      this.cbo = (this.orderForm.get('checkBoxOption') as FormArray);
      
      this.route.queryParams.subscribe(
        (queryParams: any) =>{
            self.appService.budgetItems().subscribe(function(budgetItems){
            self.items = budgetItems;

            self.idInput = queryParams.id;
            self.appService.budgetEdit(self.idInput).subscribe(function(data){
                self.returnedData = data;
                console.log(data);
                
                
                
                self.cmd = Object.assign(self.cmd, self.returnedData[1]);
                self.qtd = Object.assign(self.qtd, self.returnedData[8]);
                self.cod = Object.assign(self.cod, self.returnedData[2]);
                self.ite = Object.assign(self.ite, self.returnedData[4]);
                self.det = Object.assign(self.det, self.returnedData[3]);
                self.med = Object.assign(self.med, self.returnedData[5]);
                self.nec = Object.assign(self.nec, self.returnedData[6]);
                self.val = Object.assign(self.val, self.returnedData[9]);
                self.orc = Object.assign(self.orc, self.returnedData[10]);
                
                //Dados de  cliente
                //12: Cliente Jurídico
                //13: Pessoa
                //14: Cliente Empresa
                //15: Vendedor
                self.jur = Object.assign(self.jur, self.returnedData[12]);
                self.pes = Object.assign(self.pes, self.returnedData[13]);
                self.ter = Object.assign(self.ter, self.returnedData[14]);
                self.ven = Object.assign(self.ven, self.returnedData[15]);

                console.log(self.ite);
                self.qtd.forEach(function(value, index){
                    self.b.qtd = parseFloat(self.qtd[index].quantidades);
                    self.b.cod = self.cod[index].codigos;
                    self.b.item = self.ite[index].itens;
                    self.b.detalhe = self.det[index].detalhes;
                    self.b.medida = self.med[index].medidas;
                    self.b.comodo = self.cmd[index].comodos;
                    self.b.necessario = self.nec[index].necessidades;

                    console.log(self.appService.converteFloatMoeda(parseFloat(self.val[index].valores.replace(',','.'))));
                    console.log(parseFloat(self.qtd[index].quantidades.replace(',','.')));
                    
                    //self.b.valorUnitario = self.appService.converteFloatMoeda((parseFloat(self.val[index].valores.replace(',','.')) / parseFloat(self.qtd[index].quantidades.replace(',','.'))).toFixed(2));
                    
                    self.b.valorUnitario = self.appService.converteFloatMoeda((parseFloat(self.val[index].valores.replace(',','.')).toFixed(2)));
                    
                    console.log(self.b.valorUnitario);
                    
                    //self.b.valorTotal = "R$ " + self.val[index].valores;
                    //self.b.valorTotal = self.appService.converteFloatMoeda(self.val[index].valores.replace(',','.'));
                    self.b.valorTotal= self.appService.converteFloatMoeda((parseFloat(self.val[index].valores.replace(',','.')) * parseFloat(self.qtd[index].quantidades.replace(',','.'))).toFixed(2));
                    console.log(self.b.valorTotal);
                    
                    //b.valorTotal e b.valorUnitario no formato de Moeda.(R$1.000,00)
                    console.log(self.orc[0].desconto);
                    if(!self.orc[0].desconto){
                        self.orc[0].desconto = "0";
                    }
                    self.b.valorComDesconto = parseFloat((self.appService.converteMoedaFloat(self.b.valorTotal) - self.appService.converteMoedaFloat(self.b.valorTotal) * (self.orc[0].desconto.replace(',','.')/100)).toFixed(2));
                    console.log(self.b.valorComDesconto);
                    self.b.desconto = parseFloat(self.orc[0].desconto);
                    //self.b.valorComDesconto = 0;
                    self.addItem(self.b);
                    self.b = {
                            qtd: 0,
                            cod: "",
                            item: "",
                            detalhe: "",
                            medida: "",
                            comodo: "",
                            necessario: "",
                            valorUnitario: null,
                            valorTotal: null,
                            desconto: 0,
                            valorComDesconto: 0
                    }
                    
                    self.cmds.push(self.cmd[index].comodos);    
                });
                
                self.cmds = self.cmds.filter(function(data,i){
                   return self.cmds.indexOf(data) === i;
                });
                
                self.cmds.forEach(function(value){
                   self.addPlace(value); 
                });
                
                self.loadPage = true;
                console.log(self.budgets);

                //if(self.orc[0].pessoa_id == null){
                    self.setClient("LOJ", self.jur[0].nome, self.jur[0].telefone, self.jur[0].celular, self.jur[0].email, self.jur[0].endereco, self.jur[0].id, self.ter[0].id, self.ven[0].id);
                    self.setThirdy(self.ter[0].nome, self.ter[0].telefone, self.ter[0].celular, self.ter[0].email, self.ter[0].endereco, self.ter[0].id);
                    self.typeClient = "LOJ";
                    self.nameClient = self.jur[0].nome;
                    self.nameThirdy = self.ter[0].nome;
                    self.nameVendor = self.ven[0].nome;
                //} //else{
                //    self.setClient("FIS", self.pes[0].nome, self.pes[0].telefone, self.pes[0].celular, self.pes[0].email, //self.pes[0].endereco, self.pes[0].id, null, null);
                //}
                
                if(self.orc[0].aprovado['data'][0] == '1'){
                    self.approved = true;
                }else{
                   self.approved = false;
                }
                console.log(self.orc[0].aprovado['data'][0]);
                self.mainBudget.number = self.orc[0].id; 
                self.mainBudget.rectified = self.orc[0].retificado + 1;
                self.mainBudget.client = self.client; 
                console.log(self.client);
                self.mainBudget.date = self.orc[0].data; 
                self.formin.date = self.orc[0].data;
                //self.formin.type = self.orc[0].tipoCliente;
                
                console.log(self.orc[0].data);
                self.mainBudget.terceiro = self.thirdy; 
                self.mainBudget.vendor = self.ven[0].nome; 
                //mainBudget.valorTotal com decimal separado por ponto (.), formato normal de float
                self.mainBudget.valorTotal = parseFloat(self.orc[0].valorTotal.replace(',','.')); 
                console.log(self.orc[0].valorTotal);
                //self.mainBudget.valorTotal = self.appService.converteMoedaFloat("R$ " + self.orc[0].valorTotal.toFixed(2).replace('.',','));
                self.mainBudget.discount = self.orc[0].desconto;
                self.discount = self.orc[0].desconto;
                
                if(self.orc[0].observacao){
                   self.mainBudget.note = self.orc[0].observacao + " ";
                } else{
                    self.mainBudget.note = " ";
                }
                
                console.log(self.mainBudget.valorTotal);
                console.log(self.mainBudget.discount);
                console.log("VALOR TOTAL: " + self.orc[0].valorTotal);
                console.log("DESCONTO: " + self.mainBudget.discount);
                self.mainBudget.valorComDesconto = parseFloat((self.orc[0].valorTotal.replace(',','.') - self.orc[0].valorTotal.replace(',','.') * (self.mainBudget.discount/100)).toFixed(2));
                console.log(self.mainBudget.valorComDesconto);
                
                self.formout.budgetId = self.mainBudget.number;
                self.formout.store = self.nameClient;
                self.formout.thirdy = self.mainBudget.terceiro.name;
                self.formout.seller = self.mainBudget.vendor;
                self.formout.date = self.mainBudget.date;
                self.parameterService.setBudgets(self.budgets);
                var objs: Object[] = [];
                console.log(self.idInput);
                self.appService.findBudgetItems(self.idInput).subscribe(function(data){
                    console.log(data);
                    objs = Object.assign(objs, data);
                    objs.forEach(function(value){
                        let b = {} as BudgetItem;
                        b.id = value['id'];
                        b.ambient = value['comodo'];
                        b.budget = self.idInput;
                        b.cod = value['codigo'];
                        b.detail = value['detalhe'];
                        b.discount = value['desconto'];
                        b.discountValue = value['valorComDesconto'];
                        b.item = value['item'];
                        b.measure = value['medida'];
                        b.necessary = value['necessario'];
                        b.number = value['numero'];
                        b.qtd = value['quantidade'];
                        b.totalValue = value['valorTotal'];
                        b.unitValue = value['valorUnitario'];
                        self.budgetItems.push(b);
                    });
                    console.log(self.budgetItems);
                });
            })
        }
      );
             });
  }
}