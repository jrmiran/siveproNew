import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AppService} from '../../app.service';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {ItemBudgetV2} from '../item-budget.model';
import {BudgetV2} from '../budget-v2.model';
import {BudgetV2PdfService} from '../budget-v2-pdf.service';
import {ItemByAmbient} from '../item-by-ambient.model';
import {ModalComponent} from '../../shared/modal/modal.component';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-new-budget-v2',
  templateUrl: './new-budget-v2.component.html',
  styleUrls: ['./new-budget-v2.component.css']
})
export class NewBudgetV2Component implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router, public appService: AppService, private formBuilder: FormBuilder, private budgetPdf: BudgetV2PdfService, private spinner: NgxSpinnerService) { }
    //PARAMS-------------
    store: any;
    client: any;
    seller: any;
    params: any;
    itemsBudgetParam: any;
    serviceOrders: any;
    // ------------------
    
    // VARIABLES -------------------
    serviceOrderParams: any;
    spinnerText: string = "";
    release = false;
    items: Object[] = [];
    main: any;
    ambients: string[] = [''];
    ambientsEdit: string[] = [];
    selectedAmbients: string[] = [];
    newBudgetForm: FormGroup;
    ambientsForm: FormArray;
    itemsBudget: ItemBudgetV2[] = [];
    newItemsBudget: ItemBudgetV2[] = [];
    oldItemsBudget: ItemBudgetV2[] = [];
    enableAddItem: boolean = false;
    selectedItemBudget: ItemBudgetV2;
    budget = {} as BudgetV2;
    freightValue: number = 0;
    itemByAmbient: ItemByAmbient[] = [];
    modal = {} as ModalComponent;
    noteText = "ORÇAMENTO SUJEITO A ALTERAÇÃO DE VALOR APÓS MEDIÇÃO E CONFERÊNCIA DO PROJETO EM LOCO" + String.fromCharCode(10) +"ORÇAMENTO VÁLIDO POR 10 DIAS"+ String.fromCharCode(10) +"CUBAS DE LOUÇA E INOX NÃO INCLUSAS NO ORÇAMENTO"+ String.fromCharCode(10) + "DESCONTO NÃO APLICÁVEL SOBRE O FRETE" + String.fromCharCode(10) + "PARA DEKTON, QUARTZO E CORIAN: VALOR SUJEITO A ALTERAÇÃO EM FUNÇÃO DA TAXA DE CÂMBIO DO DÓLAR OU EURO" + String.fromCharCode(10) + String.fromCharCode(10) + "PAGAMENTO A VISTA COM 5% DE DESCONTO, SENDO 70% NO ATO E 30% NA ENTREGA" + String.fromCharCode(10) + "FORMA DE PAGAMENTO: ";
    budgetType = "";
    indexItemToRemove: number = 0;
    serviceOrdersToRemove: number[] = [];
    // ------------------------------
    
    // FUNÇÃO DO BOTÃO NA TABELA DE ITENS QUE ADCIONA UM ITEM AO ORÇAMENTO ----------------------------
    addItemBudget(itemId: any){
        var self = this;
        self.selectedAmbients.forEach(function(data){
            var item = {} as ItemBudgetV2;
            item.id = 0;
            item.unitValue = self.appService.converteMoedaFloat(self.items.find((v) => {return v['id'] == itemId})['valorUnitario']);
            item.totalValue = item.unitValue;
            item.discountValue = self.appService.discountValue(item.totalValue, self.budget.discount);
            item.item = self.items.find((v) => {return v['id'] == itemId})['descricao'];
            item.ambient = data;
            item.cod = itemId;
            item.discount = self.budget.discount;
            item.detail = '';
            item.measure = '';
            item.necessary = '';
            item.number = 0;
            item.qtd = 1;
            item.serviceOrderId = 0;

            self.itemsBudget.push(item);
            if(self.budgetType == "Edit"){
                self.newItemsBudget.push(item);
            }
            
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
        
        this.newItemsBudget = this.newItemsBudget.filter((v)=>{v != this.selectedItemBudget});
        
        if(this.budgetType == "Edit"){
            this.oldItemsBudget.push(this.selectedItemBudget);
        }
        if(this.selectedItemBudget.serviceOrderId != 0){
            this.serviceOrdersToRemove.push(this.selectedItemBudget.serviceOrderId);
        }    
    }
    // -------------------------------------------------------------------------------------------------
    // FUNÇÃO CHAMADA PELA TABLE AO CLICAR NO BOTÃO DE EXCLUSÃO DE ITEM --------------------------------
    removeClickButton(i: number){
        if(this.itemsBudget[i].serviceOrderId != 0){
            this.indexItemToRemove = i;
            document.getElementById('openConfirmation').click();
        }else{
            this.removeItemBudget(i);
        }
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
        this.selectedItemBudget = this.itemsBudget[i];
        setTimeout(()=>{
            this.newBudgetForm.get('txtQtd').setValue(this.selectedItemBudget.qtd);
            this.newBudgetForm.get('txtNecessary').setValue(this.selectedItemBudget.necessary);
            this.newBudgetForm.get('txtMeasure').setValue(this.selectedItemBudget.measure);
            this.newBudgetForm.get('txtUnitValue').setValue(this.selectedItemBudget.unitValue);
            this.newBudgetForm.get('txtDetail').setValue(this.selectedItemBudget.detail);  
        }, 10);
        
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
        this.selectedItemBudget.totalValue = this.appService.toFixed2(this.selectedItemBudget.qtd * this.selectedItemBudget.unitValue);
        this.selectedItemBudget.discountValue = this.appService.toFixed2(this.appService.discountValue(this.selectedItemBudget.totalValue, this.budget.discount));
        //ATUALIZA VALORES DO ORÇAMENTO
        this.budget.totalValue = this.appService.toFixed2(this.budget.totalValue + this.selectedItemBudget.totalValue);
        this.budget.discountValue = this.appService.toFixed2(this.budget.discountValue + this.selectedItemBudget.discountValue);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'APLICAR DESCONTO' QUE APLICA O DESCONTO NO ORÇAMENTO --------------------------
    applyDiscount(){
        var self = this;
        this.budget.discount = parseFloat(this.newBudgetForm.get('txtDiscount').value);
        this.itemsBudget.forEach(function(data){
            data.discount = self.budget.discount;
            data.discountValue = self.appService.discountValue(data.totalValue, self.budget.discount);
        });
        
        this.budget.discountValue = this.appService.toFixed2(this.appService.discountValue(this.budget.totalValue - this.budget.freightValue, this.budget.discount));
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'APLICAR FRETE' QUE APLICA O VALOR DE FRETE AO ORÇAMENTO -----------------------
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
        
        this.spinnerText = "Processando Orçamento...";
        this.spinner.show();
        
        self.budget.retificated = self.budget.retificated + 1;
        console.log(this.budget);
        var params = {budget: this.budget, itemsBudget: this.itemsBudget.filter((v) => {return v.item != "LINHA DE SEPARAÇÃO"})};
        this.separeteItemByAmbient();
        
        this.appService.postInsertBudget(params).subscribe(function(data){
            self.budget.id = data[0]['insertId'];
            self.budgetPdf.generatePDF(self.itemByAmbient, self.budget, self.store, self.client, self.seller);
            self.spinner.hide();
            self.router.navigate(['/budget']);
        });
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'EDITAR ORÇAMENTO' QUE EDITA O ORÇAMENTO ---------------------------------------
    editBudget(){
        var self = this;
        
        this.spinnerText = "Editando Orçamento...";
        this.spinner.show();
        
        self.budget.retificated = self.budget.retificated + 1;
        var params = {budget: this.budget, itemsBudget: this.itemsBudget.filter((v) => {return v.item != "LINHA DE SEPARAÇÃO"}), newItemsBudget: this.newItemsBudget, oldItemsBudget: this.oldItemsBudget, serviceOrdersToRemove: this.serviceOrdersToRemove};
        
        this.separeteItemByAmbient();
        
        this.appService.postEditBudget(params).subscribe(function(data){
            self.budgetPdf.generatePDF(self.itemByAmbient, self.budget, self.store, self.client, self.seller);
            self.spinner.hide();
            self.router.navigate(['/budget']);
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
        
        self.ambientsEdit = ambients;
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ADICIONA LINHA DE SEPARAÇÃO POR AMBIENTES -------------------------------------------
    addSeparationRows(){
        this.separeteItemByAmbient();
        var newItemsBudget: ItemBudgetV2[] = [];
        this.itemByAmbient.forEach((v)=>{
            let separationRow = {} as ItemBudgetV2;
            separationRow.ambient = v.ambient;
            separationRow.item = "LINHA DE SEPARAÇÃO";
            newItemsBudget.push(separationRow);
            v.items.forEach((item)=>{
                newItemsBudget.push(item);
            })
        })
        
        this.itemsBudget = newItemsBudget;
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO 'OK' DO MODAL PARA MODIFICAR ITEM DO ORÇAMENTO ---------------------------------
    okButtonModal(event){
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO PARA MODIFICAÇÃO DE ITEM DO ORÇAMENTO ---------------------------------------------------
    changeItem(data: any){
        this.selectedItemBudget.cod = data['id'];
        this.selectedItemBudget.item = data['descricao'];
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ATIVA O MODAL PARA ALTERAR ITEM (ATIVADO PELA TABLE) --------------------------------
    openModalChangeItem(i: number){
        this.selectedItemBudget = this.itemsBudget[i];
        document.getElementById('openModalChangeItem').click();
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE ATRIBUI VALORES DE ITEMSBUDGET RECEBIDOS POR PARAMETRO ------------
    assignItemsBudget(){
        this.itemsBudgetParam.forEach((v)=>{
            var item = {} as ItemBudgetV2;
            item.id = v['id'];
            item.qtd = parseFloat(v['quantidade']);
            item.cod = v['codigo'];
            item.item = v['item'];
            item.detail = v['detalhe'];
            item.measure = v['medida'];
            item.ambient = v['comodo'];
            item.necessary = v['necessario'];
            item.unitValue = this.appService.toFixed2(parseFloat(v['valorUnitario']));
            item.totalValue = this.appService.toFixed2(parseFloat(v['valorTotal']));
            item.discount = parseFloat(v['desconto']);
            item.discountValue = this.appService.toFixed2(parseFloat(v['valorComDesconto']));
            item.number = v['numero'];
            item.serviceOrderId = this.serviceOrders.find((d)=>{return d['itemOrcamento_id'] == item.id}) ? parseFloat(this.serviceOrders.find((d)=>{return d['itemOrcamento_id'] == item.id})['id']) : 0;
            this.itemsBudget.push(item);
        });
        this.sortItems();
        this.separeteItemByAmbient();
        this.ambientsEdit.forEach((v) => {
            this.addAmbient(v);
        })
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO "GERAR PDF" DA EDIÇÃO DE ORÇAMENTO ---------------------------------------------
    generatePDF(){
        this.separeteItemByAmbient();
        this.budgetPdf.generatePDF(this.itemByAmbient, this.budget, this.store, this.client, this.seller);
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO "DUPLICAR ORÇAMENTO" DA EDIÇÃO DE ORÇAMENTO ------------------------------------
    duplicateBudget(){
        var self = this;
        this.spinnerText = "Dupllicando Orçamento ...";
        this.spinner.show();
        this.budget.retificated = 1;
        this.budget.approved = 0;
        var params = {budget: this.budget, itemsBudget: this.itemsBudget.filter((v) => {return v.item != "LINHA DE SEPARAÇÃO"})};
        
        this.appService.postInsertBudget(params).subscribe(function(data){
            self.budget.id = data[0]['insertId'];
            alert("Orçamento duplicado com o número " + self.budget.id);
            self.spinner.hide();
            self.router.navigate(['/budget']);
        });
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO "APROVAR" OU "REJEITAR" DA EDIÇÃO DE ORÇAMENTO ---------------------------------
    changeBudgetStatus(status: string){
        this.spinner.show();
        var self = this;
        var params = {budgetId: this.budget.id, status: status};
        this.appService.postEditBudgetStatus(params).subscribe(function(data){
            self.budget.status = status;
            if(status == 'Aprovado'){
                alert("Orçamento Aprovado");
            }else if(status == 'Rejeitado'){
                alert("Orçamento Rejeitado");
            } if(status == 'Em Análise'){
                alert("Orçamento Em Análise");
            }
            self.spinner.hide();
        });
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO DO BOTÃO "ORDEM DE SERVIÇO" DA EDIÇÃO DE ORÇAMENTO --------------------------------------
    navigateServiceOrder(){
        this.serviceOrderParams = {budget: JSON.stringify(this.budget), 
                                   itemsBudget: JSON.stringify(this.getItemsBudgetNoSeparation()), 
                                   client: JSON.stringify(this.client), 
                                   store: JSON.stringify(this.store),
                                   seller: JSON.stringify(this.seller)};
        
        setTimeout(() => {
            document.getElementById('serviceOrderButton').click();
        },1000);
        
    }
    // ------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE RETORNA ITEMS DO ORÇAMENTO SEM SEPARAÇÃO DE LINHA -----------------------------------
    getItemsBudgetNoSeparation(){
        return this.itemsBudget.filter((v) => {return v.item != "LINHA DE SEPARAÇÃO"});
    }
    // ------------------------------------------------------------------------------------------------
    
    // FUNÇÃO DO BOTÃO 'SIM' DO MODAL DE CONFIRMAÇÃO PARA REMOVER ITEM --------------------------------
    yesConfirmationBox(e){
        this.removeItemBudget(this.indexItemToRemove);
    }
    // ------------------------------------------------------------------------------------------------
    
    // FUNÇÃO DO BOTÃO 'NÃO' DO MODAL DE CONFIRMAÇÃO PARA REMOVER ITEM --------------------------------
    noConfirmationBox(e){}
    // ------------------------------------------------------------------------------------------------
    
    ngOnInit() {
        var self = this;
        this.main = this;
        this.ambientsForm = this.formBuilder.array([new FormControl(false)]);
        this.spinnerText = "Carregando Itens ...";
        this.spinner.show();
        // ------------------ START ASSIGN PARAMETERS ------------------------
        this.route.queryParams.subscribe(
            (queryParams: any) =>{
                self.params = queryParams;
                
                self.store = JSON.parse(self.params['store']);
                self.client = JSON.parse(self.params['client']);
                self.seller = JSON.parse(self.params['seller']);
                if(self.params['budget'] != "{}"){
                    self.budget = JSON.parse(self.params['budget']);
                    self.budget.note = self.appService.replaceAll(self.budget.note, "QUEBRADELINHA", String.fromCharCode(10));
                    self.budgetType = "Edit";
                    
                }
                if(self.params['itemsBudget']){
                    self.itemsBudgetParam = JSON.parse(self.params['itemsBudget']);
                    self.serviceOrders = JSON.parse(self.params['serviceOrders']);
                    self.assignItemsBudget();
                }
                
                
                // ------------------ START INITIALIZE BUDGET VAR --------------------
                if(self.params['budget'] == "{}"){
                    self.budgetType = "New";
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
                    self.budget.status = "Em Análise";
                }
                // ------------------ END INITIALIZE BUDGET VAR ----------------------
                self.release = true;
            }
        );
        // ------------------ END ASSIGN PARAMETERS ------------------------
        
        // ------------------ START LOAD ITEMS ------------------------
        this.appService.postSearchAllItems().subscribe(function(data){
            self.items = data;
            self.spinner.hide();
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

            self.newBudgetForm.get('txtNote').setValue(self.budget.note);

        
        
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