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

@Component({
  selector: 'sivp-budget-edit',
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.css']
})
export class BudgetEditComponent implements OnInit {

constructor(private formBuilder: FormBuilder, private appService: AppService, private start: StartService, private route: ActivatedRoute, private router: Router, private spinner: NgxSpinnerService) { }
    
      @HostListener('window:keyup', ['$event'])
      keyEvent(event: KeyboardEvent) {
        console.log(event);

        if (event.keyCode === KEY_CODE.DELETE) {
          this.removeItem();
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
    
    
    //b = {} as BudgetNew;
    self = this;
    idInput: number;
    loadItems: boolean = false;
    items: Object[];
    cmds: string[] = [];
    formin= {type: "", client: "", vendor: "", thirdy: "", date: ""};
    budgets: BudgetNew[] = [];
    returnedData: Object[];
    //places = {} as string[];
    //checks = {} as string[];
    places: string[] = [];
    checks: string[] = [];
    currentValue: number;
    
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
        
        
        this.budgets[this.currentItem].qtd = parseFloat((this.budgets[this.currentItem].qtd + (this.modalForm.get('medida1SubItem').value * this.modalForm.get('medida2SubItem').value)/10000).toFixed(2));
        
        this.budgets[this.currentItem].detalhe = this.budgets[this.currentItem].detalhe + "\n*" +  this.modalForm.get('qtdSubItem').value + " " + this.modalForm.get('unidadeSubItem').value + " " + this.modalForm.get('medida1SubItem').value + "x" + this.modalForm.get('medida2SubItem').value + " " + this.modalForm.get('descricaoSubItem').value;
        this.budgets[this.currentItem].valorTotal = this.appService.converteFloatMoeda(parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario)).toFixed(2)));
        
        
        console.log(this.budgets[this.currentItem].valorUnitario);
        this.modalForm.get('qtdSubItem').setValue("");
        this.modalForm.get('unidadeSubItem').setValue("");
        this.modalForm.get('medida1SubItem').setValue("");
        this.modalForm.get('medida2SubItem').setValue("");
        this.modalForm.get('descricaoSubItem').setValue("");
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
        var qtd: number = parseFloat(this.orderForm.get('txtQtd').value.toString().replace(',','.'));
        var valor: number = parseFloat(this.orderForm.get('txtValor').value.toString().replace(',','.'));
        var medida1: number = parseFloat(this.orderForm.get('txtMedida1').value);
        var medida2: number = parseFloat(this.orderForm.get('txtMedida2').value);
        
        this.budgets[this.currentItem].qtd = this.orderForm.get('txtQtd').value;
        this.budgets[this.currentItem].necessario = this.orderForm.get('txtNecessario').value;
        this.budgets[this.currentItem].detalhe = this.orderForm.get('txtDetalhe').value;
        this.budgets[this.currentItem].valorUnitario = this.appService.converteFloatMoeda(this.orderForm.get('txtValor').value);
        if(this.pedraOption){
           this.budgets[this.currentItem].valorTotal = (medida1 * medida2 * valor)/ 10000; 
            this.budgets[this.currentItem].medida = this.orderForm.get('txtMedida1').value + " x " + this.orderForm.get('txtMedida2').value;
        } else{
            this.budgets[this.currentItem].valorTotal = this.appService.converteFloatMoeda(parseFloat((this.budgets[this.currentItem].qtd * this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario)).toFixed(2)));
            this.budgets[this.currentItem].medida = this.orderForm.get('txtMedida').value;
        }
        this.mainBudget.valorTotal = this.mainBudget.valorTotal + this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal) - this.currentValue;
        
        this.pedraOption = false;
        console.log(this.budgets[this.currentItem].valorUnitario);
        
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
    
    public clickRow(i: number){
        console.log("clickRow Edit")
        this.currentItem = i;
        console.log(this.budgets[this.currentItem].valorUnitario);
        console.log(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtQtd').setValue(this.budgets[this.currentItem].qtd);
        this.orderForm.get('txtNecessario').setValue(this.budgets[this.currentItem].necessario);
        this.orderForm.get('txtMedida').setValue(this.budgets[this.currentItem].medida);
        this.orderForm.get('txtValor').setValue(this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario));
        this.orderForm.get('txtDetalhe').setValue(this.budgets[this.currentItem].detalhe);
        this.currentValue = this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorUnitario);
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
        this.discount = parseFloat(this.orderForm.get('txtDiscount').value);
        this.mainBudget.discount = this.discount;
        this.mainBudget.valorComDesconto = this.mainBudget.valorTotal - this.mainBudget.valorTotal * (this.discount/100);
        console.log(this.mainBudget.valorTotal);
        console.log(this.mainBudget.valorComDesconto);
    }
    
    buildComodos(){
        const values = this.checks.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    addItem(b: BudgetNew){
        this.budgets.push(b);
    }
    
    addItemBudget(b: BudgetNew){
        this.budgets.push(b);
    }
    
    convertBudgetToString(): Promise<any>{
        var self = this;
        
        return new Promise(function(resolve, reject){
            //self.insertedBudget = data['insertId'];
        
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
                        self.qtdsString = response;
                });
            self.fillStringToQuery(self.cods, self.codsString, self.mainBudget.number)
                .then(function(response){
                        self.codsString = response;
                });
            self.fillStringToQuery(self.itemss, self.itemsString, self.mainBudget.number)
                .then(function(response){
                        self.itemsString = response;
                });
            self.fillStringToQuery(self.detalhes, self.detalhesString, self.mainBudget.number)
                .then(function(response){
                        self.detalhesString = response;
                });
            self.fillStringToQuery(self.medidas, self.medidasString, self.mainBudget.number)
                .then(function(response){
                        self.medidasString = response;
                });
            self.fillStringToQuery(self.comodos, self.comodosString, self.mainBudget.number)
                .then(function(response){
                        self.comodosString = response;
                });
            self.fillStringToQuery(self.necessarios, self.qtdsString, self.mainBudget.number)
                .then(function(response){
                        self.necessariosString = response;
                });
            self.fillStringToQuery(self.valoresUnitarios, self.valoresUnitariosString, self.mainBudget.number)
                .then(function(response){
                        self.valoresUnitariosString = response;
                });
            self.fillStringToQuery(self.valoresTotais, self.valoresTotaisString, self.mainBudget.number)
                .then(function(response){
                        self.valoresTotaisString = response;
                });
            self.fillStringToQuery(self.descontos, self.descontosString, self.mainBudget.number)
                .then(function(response){
                        self.descontosString = response;
                });
            self.fillStringToQuery(self.valoresComDesconto, self.valoresComDescontoString, self.mainBudget.number)
                .then(function(response){
                        self.valoresComDescontoString = response;
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
    
    removeItem(){
        var i: number;
        i = this.currentItem;
        
        this.mainBudget.valorTotal = parseFloat((this.mainBudget.valorTotal - this.appService.converteMoedaFloat(this.budgets[this.currentItem].valorTotal)).toFixed(2));
        
        if(this.currentItem >=0){
            this.budgets = this.budgets.slice(0,i).concat(this.budgets.slice(i+1,this.budgets.length));
        } else{
            alert("NÃO HÁ ITEM SELECIONADO");
        }
        
    }
    
    retifyBudget(){
        var self = this;
        this.spinner.show();
        this.convertBudgetToString().then(function(data){
           self.appService.budgetUpdate(self.mainBudget.number, self.mainBudget.discount, self.mainBudget.note, self.mainBudget.rectified, self.mainBudget.valorTotal, self.codsString, self.comodosString, self.detalhesString, self.itemsString, self.medidasString, self.necessariosString, "(1,'0')", self.qtdsString, self.valoresUnitariosString).subscribe(function(value){
               self.joinBudget();
               self.createPdf.gerarPDF(self.budgetsAmbient, self.mainBudget);
               console.log(value);
               self.spinner.hide();
               self.router.navigate(['budget']);
               alert("ORÇAMENTO " + self.mainBudget.number + " RETIFICADO");
           });
        });
    }
    
  ngOnInit() {
      
      var self = this;
      setTimeout(() => self.spinner.show(), 10);
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
                self.cmd.forEach(function(value, index){
                    self.b.qtd = parseFloat(self.qtd[index].quantidades);
                    self.b.cod = self.cod[index].codigos;
                    self.b.item = self.ite[index].itens;
                    self.b.detalhe = self.det[index].detalhes;
                    self.b.medida = self.med[index].medidas;
                    self.b.comodo = self.cmd[index].comodos;
                    self.b.necessario = self.nec[index].necessidades;
                    self.b.valorUnitario = self.appService.converteFloatMoeda(parseFloat(self.val[index].valores.replace(',','.')) / parseFloat(self.qtd[index].quantidades.replace(',','.')));
                    self.b.valorTotal = "R$ " + self.val[index].valores;
                    self.b.desconto = 0;
                    self.b.valorComDesconto = 0;
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
                //console.log(self.cmds);
                /*self.cmd.forEach(function(value, index){
                    if(self.cmds.indexOf(self.cmd[index].comodos) > -1){
                        self.addPlace(self.cmd[index].comodos);
                    }
                    self.cmds.push(self.cmd[index].comodos);
                    
                });*/
                
                self.spinner.hide();
                self.loadPage = true;
                console.log(self.budgets);

                if(self.orc[0].pessoa_id == null){
                    self.setClient("LOJ", self.jur[0].nome, self.jur[0].telefone, self.jur[0].celular, self.jur[0].email, self.jur[0].endereco, self.jur[0].id, self.ter[0].id, self.ven[0].id);
                    self.setThirdy(self.ter[0].nome, self.ter[0].telefone, self.ter[0].celular, self.ter[0].email, self.ter[0].endereco, self.ter[0].id);
                    self.typeClient = "LOJ";
                    self.nameClient = self.jur[0].nome;
                    self.nameThirdy = self.ter[0].nome;
                    self.nameVendor = self.ven[0].nome;
                } else{
                    self.setClient("FIS", self.pes[0].nome, self.pes[0].telefone, self.pes[0].celular, self.pes[0].email, self.pes[0].endereco, self.pes[0].id, null, null);
                }
                
                
                self.mainBudget.number = self.orc[0].id; 
                self.mainBudget.rectified = self.orc[0].retificado + 1;
                self.mainBudget.client = self.client; 
                self.mainBudget.date = self.orc[0].data; 
                self.mainBudget.terceiro = self.thirdy; 
                self.mainBudget.vendor = self.ven[0].nome; 
                self.mainBudget.valorTotal = self.appService.converteMoedaFloat("R$ " + self.orc[0].valorTotal); 
                self.mainBudget.discount = self.orc[0].desconto;
                self.mainBudget.note = self.orc[0].observacao;
                
                if(self.orc[0].desconto != null){
                    self.mainBudget.valorComDesconto = self.orc[0].valorTotal - self.orc[0].valorTotal*self.orc[0].desconto; //FAZER CONTA
                   } else{
                       self.mainBudget.valorComDesconto = self.orc[0].valorTotal;
                   }
                self.mainBudget.note = self.orc[0].observacao;
            })
        }
      );
             });
  }
}