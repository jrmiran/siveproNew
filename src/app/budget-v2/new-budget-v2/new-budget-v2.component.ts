import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AppService} from '../../app.service';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {ItemBudgetV2} from '../item-budget.model';
import {BudgetV2} from '../budget-v2.model';
import {BudgetV2PdfService} from '../budget-v2-pdf.service';
import {ItemByAmbient} from '../item-by-ambient.model';

@Component({
  selector: 'sivp-new-budget-v2',
  templateUrl: './new-budget-v2.component.html',
  styleUrls: ['./new-budget-v2.component.css']
})
export class NewBudgetV2Component implements OnInit {

    constructor(private route: ActivatedRoute, private appService: AppService, private formBuilder: FormBuilder, private budgetPdf: BudgetV2PdfService) { }
    //PARAMS-------------
    store: any;
    client: any;
    seller: any;
    params: any;
    // ------------------
    
    // VARIABLES -------------------
    release = false;
    items: Object[] = [];
    main: any;
    ambients: string[] = [''];
    selectedAmbients: string[] = [];
    newBudgetForm: FormGroup;
    ambientsForm: FormArray;
    itemsBudget: ItemBudgetV2[] = [];
    discount: number = 0;
    enableAddItem: boolean = false;
    selectedItemBudget: ItemBudgetV2;
    budget = {} as BudgetV2;
    freightValue: number = 0;
    itemByAmbient: ItemByAmbient[] = [];
    noteText = "ORÇAMENTO SUJEITO A ALTERAÇÃO DE VALOR APÓS MEDIÇÃO E CONFERÊNCIA DO PROJETO EM LOCO" + String.fromCharCode(10) +"ORÇAMENTO VÁLIDO POR 10 DIAS"+ String.fromCharCode(10) +"CUBAS DE LOUÇA E INOX NÃO INCLUSAS NO ORÇAMENTO"+ String.fromCharCode(10) + "DESCONTO NÃO APLICÁVEL SOBRE O FRETE" + String.fromCharCode(10) + "PARA DEKTON, QUARTZO E CORIAN: VALOR SUJEITO A ALTERAÇÃO EM FUNÇÃO DA TAXA DE CÂMBIO DO DÓLAR OU EURO" + String.fromCharCode(10) + String.fromCharCode(10) + "PAGAMENTO A VISTA COM 5% DE DESCONTO, SENDO 70% NO ATO E 30% NA ENTREGA" + String.fromCharCode(10) + "FORMA DE PAGAMENTO: ";
    // ------------------------------
    
    // FUNÇÃO DO BOTÃO NA TABELA DE ITENS QUE ADCIONA UM ITEM AO ORÇAMENTO ----------------------------
    addItemBudget(itemId: any){
        var self = this;
        self.selectedAmbients.forEach(function(data){
            var item = {} as ItemBudgetV2;
            item.unitValue = self.appService.converteMoedaFloat(self.items.find((v) => {return v['id'] == itemId})['valorUnitario']);
            item.totalValue = item.unitValue;
            item.discountValue = self.appService.discountValue(item.totalValue, self.discount);
            item.item = self.items.find((v) => {return v['id'] == itemId})['descricao'];
            item.ambient = data;
            item.cod = itemId;
            item.discount = self.discount;
            item.detail = '';
            item.measure = '';
            item.necessary = '';
            item.number = 0;
            item.qtd = 1;

            self.itemsBudget.push(item);
            
            self.budget.totalValue = self.appService.toFixed2(self.budget.totalValue + item.totalValue);
            self.budget.discountValue = self.appService.toFixed2(self.budget.discountValue + item.discountValue);
        });
        self.sortItems();
    }
    // -------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO NA TABELA DE ITENS QUE REMOVE UM ITEM AO ORÇAMENTO ----------------------------
    removeItemBudget(i: any){
        this.selectedItemBudget = this.itemsBudget[i];
        this.budget.totalValue = this.appService.toFixed2(this.budget.totalValue - this.selectedItemBudget.totalValue);
        this.budget.discountValue = this.appService.toFixed2(this.budget.discountValue - this.selectedItemBudget.discountValue);
        
        this.itemsBudget = this.itemsBudget.slice(0,i).concat(this.itemsBudget.slice(i+1,this.itemsBudget.length));
    }
    // -------------------------------------------------------------------------------------------------
    // FUNÇÕES QUE ADCIONAM E REMOVEM AMBIENTES NA LISTA DE AMBIENTES, SÃO CHAMADAS PELA TABLE -------
    addAmbient(ambient: string){
        this.ambients.push(ambient);
        this.ambientsForm.push(new FormControl(false));
    }
    removeAmbient(i: number){
        this.ambients = this.ambients.slice(0,i).concat(this.ambients.slice(i+1,this.ambients.length));
        this.ambientsForm.removeAt(i);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ORDENA OS ITENS POR AMBIENTE PARA EXIBIÇÃO NA TABELA --------------------------------
    sortItems(){
        this.itemsBudget.sort((a,b) => a.ambient.localeCompare(b.ambient));
        this.addSeparationRows();
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE TROCA O AMBIENTE DE UM ITEM JÁ INCLUÍDO NA TABELA -----------------------------------
    changeAmbient(a: string){
        this.itemsBudget.find((v) => {return v == this.selectedItemBudget}).ambient = a;
        this.sortItems();
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ATIVA ITEM AO CLICAR NA TABELA ------------------------------------------------------
    activateItem(data: any, i: number){
        //this.selectedItemBudget = this.itemsBudget.find((v) => {return v == data});
        this.selectedItemBudget = this.itemsBudget[i];
        this.newBudgetForm.get('txtQtd').setValue(this.selectedItemBudget.qtd);
        this.newBudgetForm.get('txtNecessary').setValue(this.selectedItemBudget.necessary);
        this.newBudgetForm.get('txtMeasure').setValue(this.selectedItemBudget.measure);
        this.newBudgetForm.get('txtUnitValue').setValue(this.selectedItemBudget.unitValue);
        this.newBudgetForm.get('txtDetail').setValue(this.selectedItemBudget.detail);
        
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'ALTERAR' PARA APLICAR MUDANÇAS NO ITEM DO ORÇAMENTO ---------------------------
    changeItemBudget(){
        // ATUALIZA VALORES DO ORÇAMENTO RETIRANDO VALORES DO ITEM PARA RECOLOCÁ-LOS DEPOIS ---
        this.budget.totalValue = this.budget.totalValue - this.selectedItemBudget.totalValue;
        this.budget.discountValue = this.budget.discountValue - this.selectedItemBudget.discountValue;
        // ------------------------------------------------------------------------------------
        this.selectedItemBudget.qtd = this.newBudgetForm.get('txtQtd').value;
        this.selectedItemBudget.necessary = this.newBudgetForm.get('txtNecessary').value;
        this.selectedItemBudget.measure = this.newBudgetForm.get('txtMeasure').value;
        this.selectedItemBudget.unitValue = this.newBudgetForm.get('txtUnitValue').value;
        this.selectedItemBudget.detail = this.newBudgetForm.get('txtDetail').value;
        //ATUALIZA VALORES DO ITEM
        this.selectedItemBudget.totalValue = this.selectedItemBudget.qtd * this.selectedItemBudget.unitValue
        this.selectedItemBudget.discountValue = this.appService.discountValue(this.selectedItemBudget.totalValue, this.discount);
        //ATUALIZA VALORES DO ORÇAMENTO
        this.budget.totalValue = this.appService.toFixed2(this.budget.totalValue + this.selectedItemBudget.totalValue);
        this.budget.discountValue = this.appService.toFixed2(this.budget.discountValue + this.selectedItemBudget.discountValue);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'APLICAR DESCONTO' QUE APLICA O DESCONTO NO ORÇAMENTO --------------------------
    applyDiscount(){
        var self = this;
        this.discount = parseFloat(this.newBudgetForm.get('txtDiscount').value);
        this.itemsBudget.forEach(function(data){
            data.discount = self.discount;
            data.discountValue = self.appService.discountValue(data.totalValue, self.discount);
        });
        this.budget.discount = this.discount;
        this.budget.discountValue = this.appService.toFixed2(this.appService.discountValue(this.budget.totalValue - this.budget.freightValue, this.discount));
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'APLICAR FRETE' QUE APLICA O VALOR DE FRETE ------------------------------------
    applyFreight(){
        this.budget.totalValue = this.budget.totalValue - this.freightValue;
        this.freightValue = parseFloat(this.newBudgetForm.get('txtFreight').value);
        this.budget.freightValue = this.appService.toFixed2(this.freightValue);
        this.budget.totalValue = this.appService.toFixed2(this.budget.totalValue + this.freightValue);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'PROCESSAR ORÇAMENTO' QUE COLOCA O ORÇAMENTO NO BANCO DE DADOS -----------------
    processBudget(){
        var self = this;
        var params = {budget: this.budget, itemsBudget: this.itemsBudget.filter((v) => {return v.item != "LINHA DE SEPARAÇÃO"})};
        this.separeteItemByAmbient();
        console.log(params);
        this.appService.postInsertBudget(params).subscribe(function(data){
            console.log(data);
            self.budget.id = data[0]['insertId'];
            self.budget.retificated = 1;
            self.budgetPdf.generatePDF(self.itemByAmbient, self.budget, self.store, self.client, self.seller);
        });
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE DIVIDE OS ITENS POR AMBIENTE E MONTA O ARRAY DE 'itemByAmbient' PARA PDF -----------
    separeteItemByAmbient(){
        var self = this;
        var ambients: string[] = [];
        this.itemsBudget.forEach(function(data){
           if(data.item != "LINHA DE SEPARAÇÃO"){
               if(ambients.indexOf(data.ambient) < 0){
                   ambients.push(data.ambient);
               }
           } 
        });
        
        self.itemByAmbient = [];
        ambients.forEach(function(data){
            var items = {} as ItemByAmbient;
            items.ambientValue = 0;
            items.ambient = data;
            items.items = self.itemsBudget.filter((v) => {return v.ambient == data && v.item != "LINHA DE SEPARAÇÃO"});
            items.items.forEach(function(v){
                items.ambientValue = self.appService.toFixed2(items.ambientValue + v.totalValue);
            });
            self.itemByAmbient.push(items);
        })
        
        console.log(self.itemByAmbient);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ADICIONA LINHA DE SEPARAÇÃO POR AMBIENTES -------------------------------------------
    addSeparationRows(){
        var self = this;
        this.itemsBudget = this.itemsBudget.filter((v) => {
            return v.item != "LINHA DE SEPARAÇÃO";
        });
        
        let separationRow = {} as ItemBudgetV2;
        separationRow.ambient = self.itemsBudget[0].ambient;
        separationRow.item = "LINHA DE SEPARAÇÃO";
        self.itemsBudget.splice(0, 0, separationRow);
        
        this.itemsBudget.forEach(function(data, index){
            if(index < self.itemsBudget.length - 1){
                if(self.itemsBudget[index + 1].ambient != data.ambient){
                    let separationRow = {} as ItemBudgetV2;
                    separationRow.ambient = self.itemsBudget[index + 1].ambient;
                    separationRow.item = "LINHA DE SEPARAÇÃO";
                    self.itemsBudget.splice(index+1, 0, separationRow);
                }
            }
        })
    }
    // ------------------------------------------------------------------------------------------------
    ngOnInit() {
        var self = this;
        this.main = this;
        this.ambientsForm = this.formBuilder.array([new FormControl(false)]);

        // ------------------ START ASSIGN PARAMETERS ------------------------
        this.route.queryParams.subscribe(
            (queryParams: any) =>{
                self.params = queryParams;
                self.store = JSON.parse(self.params['store']);
                self.client = JSON.parse(self.params['client']);
                self.seller = JSON.parse(self.params['seller']);
                self.release = true;
                // ------------------ START INITIALIZE BUDGET VAR --------------------
                self.budget.id = 0;
                self.budget.approved = 0;
                self.budget.date = self.params['date'];
                self.budget.discount = 0;
                self.budget.note = self.noteText;
                self.budget.retificated = 0;
                self.budget.totalValue = 0;
                self.budget.storeId = self.store['id'];
                self.budget.clientId = self.client['id'];
                self.budget.sellerId = self.seller['id'];
                self.budget.poloAd = 0;
                self.budget.discountValue = 0;
                self.budget.freightValue = 0;
                // ------------------ END INITIALIZE BUDGET VAR ----------------------
            }
        );
        // ------------------ END ASSIGN PARAMETERS ------------------------
        
        // ------------------ START LOAD ITEMS ------------------------
        this.appService.postSearchAllItems().subscribe(function(data){
            self.items = data;
        });
        // ------------------ END LOAD ITEMS ------------------------
        
        // ------------------ START FORM CONFIG ------------------------
        this.newBudgetForm = this.formBuilder.group({
            txtAmbient: this.formBuilder.control(''),
            cbAmbients: this.ambientsForm,
            txtQtd: this.formBuilder.control(''),
            txtNecessary: this.formBuilder.control(''),
            txtMeasure: this.formBuilder.control(''),
            txtUnitValue: this.formBuilder.control(''),
            txtDetail: this.formBuilder.control(''),
            txtNote: this.formBuilder.control(''),
            txtFreight: this.formBuilder.control(''),
            txtDiscount: this.formBuilder.control('')
        });
        
        this.newBudgetForm.get('txtNote').setValue(this.noteText);
        
        
        this.newBudgetForm.get('cbAmbients').valueChanges.subscribe(function(data){
            self.selectedAmbients = [];
            data.forEach((v, index) => {
                if(v){
                    self.selectedAmbients.push(self.ambients[index]);
                }
            })
            if(self.selectedAmbients.length > 0){
                self.enableAddItem = true;
            }else{
                self.enableAddItem = false;
            }
        })
        // ------------------ END FORM CONFIG ------------------------
    }
}