import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import {BudgetNewComponent} from '../budget/budget-new/budget-new.component';
import {BudgetTableComponent} from '../budget/budget-table/budget-table.component';
import {BudgetService} from '../budget/budget.service';
import {BudgetNew} from '../budget/budget-new/budget-new.model';
import {CheckBox} from '../shared/check/check-box.model';
import {StartService} from '../start.service';
import {AppService} from '../app.service';
import {BudgetItemsComponent} from '../budget/budget-items/budget-items.component';
import {BudgetEditComponent} from '../budget/budget-edit/budget-edit.component';
import {ServiceOrderComponent} from '../service-order/service-order.component';
import {ServiceOrderTableComponent} from '../service-order/service-order-table/service-order-table.component';
import {UploadComponent} from '../upload/upload.component';
import {ParameterService} from '../shared/parameter.service';
import "rxjs/add/operator/map";
import {FileDropComponent} from '../file-drop/file-drop.component';
import {MaterialComponent} from '../material/material.component';
import {PaymentComponent} from '../payment/payment.component';
import {ClientSearchComponent} from '../clients/client-search/client-search.component';
import {OrderServiceTestComponent} from '../order-service-test/order-service-test.component';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {SearchProjectComponent} from '../search-project/search-project.component';
import {ServiceOrderReportComponent} from '../service-order-report/service-order-report.component';
import {RequestComponent} from '../request/request.component';
import {NewRequestComponent} from '../request/new-request/new-request.component';
import {EditRequestComponent} from '../request/edit-request/edit-request.component';
import {NewBudgetV2Component} from '../budget-v2/new-budget-v2/new-budget-v2.component'
import { ActivatedRoute, Router } from '@angular/router';
import {BudgetV2} from '../budget-v2/budget-v2.model';
import {BudgetParameterModel} from '../budget-v2/budget-parameter.model';
import {ServiceOrderV2Component} from '../service-order-v2/service-order-v2.component';
import {ServiceOrderTableV2Component} from '../service-order-v2/service-order-table-v2/service-order-table-v2.component';
import {ServiceOrderReportV2Component} from '../service-order-report-v2/service-order-report-v2.component';

@Component({
  selector: 'sivp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  constructor(private budgetComponent: BudgetService, private start: StartService, private formBuilder: FormBuilder, public uploadService: UploadComponent, private parameterService: ParameterService, private appService: AppService, private router: Router) { }

    
    /***************** START COMPONENTS INPUTS **************************/
    @Input() bnc: BudgetNewComponent;
    @Input() btc: BudgetTableComponent;
    @Input() budgetItem: BudgetItemsComponent;
    @Input() budgetEdit: BudgetEditComponent;
    @Input() soc: ServiceOrderComponent;
    @Input() sotc: ServiceOrderTableComponent;
    @Input() fdc: FileDropComponent;
    @Input() mc: MaterialComponent;
    @Input() pc: PaymentComponent;
    @Input() csc: ClientSearchComponent;
    @Input() ostc: OrderServiceTestComponent;
    @Input() spc: SearchProjectComponent;
    @Input() sorc: ServiceOrderReportComponent;
    @Input() rc: RequestComponent;
    @Input() nrc: NewRequestComponent;
    @Input() erc: EditRequestComponent;
    @Input() bncv2: NewBudgetV2Component;
    @Input() socv2: ServiceOrderV2Component;
    @Input() sotcv2: ServiceOrderTableV2Component;
    @Input() sorcv2: ServiceOrderReportV2Component;
    /***************** END COMPONENTS INPUTS **************************/
    
    /*********************** START VARIABLE INPUTS ***********************/
    @Input() name: string;
    @Input() headers: string[];
    @Input() datas: Array<Object>;
    @Input() ids: string[];
    @Input() searchBar: string = "true";
    @Input() buttonOption: boolean = false;
    @Input() check: string[];
    @Input() enableButton: boolean;
    @Input() comodos: string[];
    @Input() itemButton: boolean = false;
    @Input() ipp: number = 10;
    @Input() showPagination: boolean = true;
    @Input() budgetTable: boolean = false;
    @Input() runClickRow: boolean = true;
    @Input() dropdownButton: boolean = false;
    @Input() multipleRowsSelection: boolean = false;
    @Input() selectionButton: boolean = false;
    @Input() fdcMaterial: boolean = false;
    @Input() removeItemOption: boolean = false;
    @Input() ambients: string[];
    @Input() changeItemTable: boolean = false;
    @Input() formArraySO: FormArray;
    @Input() formGroupSO: FormGroup;
    @Input() drawTable: boolean = false;
    @Input() percentageExecution: number;
    @Input() awardTable: boolean = false;
    @Input() budgetSellection: boolean = false;
    @Input() addItemButton = false;
    @Input() enableAddItemButton = false;
    @Input() ambientsV2: string[] = [];
    /*********************** END VARIABLE INPUTS ***********************/
    
    
    releseSoc: boolean = false;
    check2 = ['CHK1', 'CHK2', 'CHK3', 'CHK4'];
    
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    
    currentLine: number = -1;
    orderForm: FormGroup;
    filter: Object;
    p: Object;
    b: BudgetNew;
    selectedRows: number[] = [];
    count: number = 0;
    flag: boolean = true;
    selectedRow: number = -1;
    paramsEditBudget: any;
    
    selectAll(){    
        var self = this;
        if (this.selectedRows.length > 0){
            this.selectedRows = [];
            if(this.soc){
                this.soc.clickRow(this.selectedRows);
            }
            if(this.socv2){
                this.socv2.clickRow(this.selectedRows);
            }
        } else{
            this.datas.forEach(function(data, index){
                 self.selectedRows.push(index);
                if(self.soc){
                    self.soc.clickRow(self.selectedRows);
                }
                if(self.socv2){
                    self.socv2.clickRow(self.selectedRows);
                }
            });
        }
    }
    
    openModalPayment(id: any){
        if(this.pc){
           this.pc.editPayment(id); 
        } else if(this.erc){
            this.erc.editPayment(id); 
        }
        
    }
    
    exportPdfSo(id: number){
        this.sotc.exportPdf(id);    
    }
    
    getTextTooltip(id: any): string{
        return "Este é um retorno" + id;
    }
    showServiceOrderModal(){
    }
    
    openBudget(id: any){
        this.btc.openBudget(id);
    }
    
    percentageToNumber(value: string){

        return "width: " + value.replace(',','.') + ";";
    }
    
    changeBudgetStatus(id: number, status: boolean){

        this.budgetComponent.changeBudgetStatus(id, status, this.btc);
    }
    
    removePayment(j: any, data: any){
        this.pc.removePayment(data);
    }
    
    addBudgetRequest(id: string){
        if(this.nrc){
            this.nrc.addBudgetRequest(id);
        }else if(this.erc){
            this.erc.addBudgetRequest(id);
        }
    }
    
    
    
    addItemBudgetV2(id: any){
        this.bncv2.addItemBudget(id);
    }
    
    openModalChangeSO(data: any){
        this.sotcv2.openModalChangeSO(data);    
    }
    
    addBudgetItem(id: string, item: string, valorUnitario: string){
        var self = this;

        if(self.bnc){
            self.bnc.setValue();
        } else if(self.budgetEdit){
            self.budgetEdit.setValue();
        }
        
        this.comodos.forEach(function(comodo){
            self.b = {
            qtd: 1,
            cod: id,
            item: item,
            detalhe: "",
            medida: "",
            comodo: comodo,
            necessario: "",
            valorUnitario: valorUnitario,
            valorTotal: valorUnitario,
            desconto: 0,
            valorComDesconto: 0    
        }
        if(self.bnc){
           self.budgetComponent.addItemBudget(self.b, self.bnc);
        }else if(self.budgetEdit){
            self.budgetComponent.addItemEditBudget(self.b, self.budgetEdit);
        }
        });
    }
    
    openBudgetsClient(id: number){
        this.csc.openBudgetsClient(id);
    }
    
    openModalItem(id: number, descricao: string, valorUnitario: string){
        this.budgetItem.openModalFunction(true, id, descricao, valorUnitario);
    }
    
    openModalServiceOrder(id: number, value: string){
        if(this.sotc){
            this.sotc.openModalFunction(true, id, value);
        } else{
            this.ostc.openModalFunction(true, id, value);
        }
        
    }
    
    selectRow(i: number): Boolean{
        if(this.selectedRows.indexOf(i) != -1){
           return true;
        }else{
            return false;
        }
    }
    
    changeAmbient(a: string){
        if(this.bnc){
            this.bnc.changeAmbient(a);    
        } else if(this.budgetEdit){
            this.budgetEdit.changeAmbient(a); 
        }
        
    }
    
    changeAmbientV2(a: string){
        if(this.bncv2){
            this.bncv2.changeAmbient(a);    
        }
    }
    
    removeItem(i: number){
        if(this.budgetEdit){
            this.budgetEdit.removeItem(i);
        }else if(this.bnc){
            this.bnc.removeItem(i);
        }
        
    }
    
    removeItemV2(i: number){
        if(this.bncv2){
            this.bncv2.removeClickButton(i);
        }
        
    }
    
    changeItem(i: number){
        if(this.budgetEdit){
            this.budgetEdit.changeItemBudget(i);
        }else if(this.bnc){
            this.bnc.changeItemBudget(i);
        }
        if(this.budgetEdit){
            this.budgetEdit.changeItemBudget(i);
        }else if(this.bncv2){
            this.bncv2.openModalChangeItem(i);
        }
    }
    
    eventRow(i:number, data: string){
        if(this.runClickRow && data['item'] != "LINHA DE SEPARAÇÃO"){
            this.selectedRow = i;
            if(!this.multipleRowsSelection){
                this.selectedRows = [];
            }
            if(this.selectedRows.indexOf(i) != -1){
                this.selectedRows = this.selectedRows.slice(0,this.selectedRows.indexOf(i)).concat(this.selectedRows.slice(this.selectedRows.indexOf(i)+1,this.selectedRows.length));
                if(this.socv2){
                    this.socv2.clickRow(this.selectedRows);
                }
            } else{
                this.selectedRows.push(i);
                if(this.socv2){
                    this.socv2.clickRow(this.selectedRows);
                }
            }
            
            if(this.changeItemTable){
                if(this.bnc){
                    this.bnc.clickRowChangeItem(data['descricao']);
                }else if(this.budgetEdit){
                    this.budgetEdit.clickRowChangeItem(data['descricao']);
                }
                
                if(this.bncv2){
                    this.bncv2.changeItem(data);
                }else if(this.budgetEdit){
                    this.budgetEdit.clickRowChangeItem(data['descricao']);
                }
            } else{
                if(this.bnc){
                    this.bnc.clickRow(i);
                }else if(this.itemButton){
                    this.budgetItem.clickRow(i);
                }else if(this.budgetEdit){
                    this.budgetEdit.clickRow(i);
                }else if(this.soc){
                    this.soc.clickRow(this.selectedRows);
                }else if(this.fdc){
                    if(!this.drawTable){
                        if(!this.fdcMaterial){
                            this.fdc.clickRow(i);
                        } else{
                            this.fdc.clickRowMaterial(data['id']);
                        }
                    } else{
                        this.fdc.clickRowDraw(i);
                    }
                }else if(this.mc){
                    this.mc.clickRow(i);
                }else if(this.spc){
                    this.spc.setCurrentDraw(data['id']);
                }else if(this.bncv2){
                    this.bncv2.activateItem(data, i);
                }
            }
            this.currentLine = i;
        }
    }
    
    openEditBudget(data: any){
        var self = this;
        var budget = {} as BudgetV2;
        var store: any;
        var client: any;
        var seller: any;
        var itemsBudget: any;
        var serviceOrders: any;
        this.appService.postSearchBudget({budgetId: data['budgetId']}).subscribe(function(v){
            budget.approved = v[1][0]['aprovado']['data'][0];
            budget.clientId = v[1][0]['clienteEmpresaa_id'];
            budget.date = v[1][0]['data'];
            budget.discount = parseFloat(v[1][0]['desconto']);
            budget.totalValue = parseFloat(v[1][0]['valorTotal']);
            budget.discountValue = self.appService.discountValue(budget.totalValue, budget.discount);
            budget.freightValue = 0;
            budget.id = v[1][0]['id'];
            budget.note = v[1][0]['observacao'];
            budget.poloAd = v[1][0]['poload']['data'][0];
            budget.retificated = v[1][0]['retificado'];
            budget.sellerId = v[1][0]['vendedor_id'];
            budget.storeId = v[1][0]['clienteJuridico_id'];
            
            store = v[2][0];
            client = v[3][0];
            seller = v[4][0];
            itemsBudget = v[5];
            serviceOrders = v[6];
            
            self.paramsEditBudget = {store: JSON.stringify(store), client: JSON.stringify(client), seller: JSON.stringify(seller), budget: JSON.stringify(budget), itemsBudget: JSON.stringify(itemsBudget), serviceOrders: JSON.stringify(serviceOrders)};
            setTimeout(() =>{
                document.getElementById('openEditBudget').click();
            }, 100);
        })
    }
    
    showSpcDraw(id: any){
        this.spc.setCurrentDraw(id);    
    }
    
    setUploadId(id: number){
        this.count = this.count + 1;
        if(this.flag){
            alert(this.count + " - " + id);
            this.parameterService.setIdOs(id);
        }
        this.flag = !this.flag;
    }
    
    buildComodos(){
        const values = this.check2.map(v => new FormControl(false));
        return this.formBuilder.array(values); 
    }
    
    
    
    ngOnInit() {
        var self = this;
        this.start.start();
        this.orderForm = this.formBuilder.group({
            checkBoxOption: this.buildComodos()
        })
        if(this.soc){
            if(this.formGroupSO){
                this.releseSoc = true;
            }
            
        }
        if(this.sorc){
        }
    }
}
