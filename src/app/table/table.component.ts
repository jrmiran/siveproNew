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

@Component({
  selector: 'sivp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  constructor(private budgetComponent: BudgetService, private start: StartService, private formBuilder: FormBuilder, public uploadService: UploadComponent, private parameterService: ParameterService) { }

    @Input() name: string;
    @Input() headers: string[];
    @Input() datas: Array<Object>;
    @Input() ids: string[];
    @Input() searchBar: string = "true";
    @Input() bnc: BudgetNewComponent;
    @Input() btc: BudgetTableComponent;
    @Input() buttonOption: boolean = false;
    @Input() check: string[];
    @Input() enableButton: boolean;
    @Input() comodos: string[];
    @Input() itemButton: boolean = false;
    @Input() ipp: number = 10;
    @Input() showPagination: boolean = true;
    @Input() budgetTable: boolean = false;
    @Input() budgetItem: BudgetItemsComponent;
    @Input() budgetEdit: BudgetEditComponent;
    @Input() runClickRow: boolean = true;
    @Input() dropdownButton: boolean = false;
    @Input() soc: ServiceOrderComponent;
    @Input() sotc: ServiceOrderTableComponent;
    @Input() multipleRowsSelection: boolean = false;
    @Input() selectionButton: boolean = false;
    @Input() fdc: FileDropComponent;
    @Input() mc: MaterialComponent;
    @Input() fdcMaterial: boolean = false;
    @Input() removeItemOption: boolean = false;
    @Input() ambients: string[];
    @Input() pc: PaymentComponent;
    @Input() changeItemTable: boolean = false;
    @Input() csc: ClientSearchComponent;
    @Input() ostc: OrderServiceTestComponent;
    @Input() formArraySO: FormArray;
    @Input() formGroupSO: FormGroup;
    @Input() drawTable: boolean = false;
    
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
    
    selectAll(){    
        var self = this;
        if (this.selectedRows.length > 0){
            this.selectedRows = [];
            if(this.soc){
                this.soc.clickRow(this.selectedRows);
            }
        } else{
            this.datas.forEach(function(data, index){
                 self.selectedRows.push(index);
                if(self.soc){
                    self.soc.clickRow(self.selectedRows);
                }
            });
        }
    }
    
    openModalPayment(id: any){
        this.pc.editPayment(id);
    }
    
    exportPdfSo(id: number){
        this.sotc.exportPdf(id);    
    }
    
    getTextTooltip(id: any): string{
        return "Este é um retorno" + id;
    }
    showServiceOrderModal(){
        console.log("Service Order Modal");
    }
    
    openBudget(id: any){
        this.btc.openBudget(id);
    }
    
    changeBudgetStatus(id: number, status: boolean){
        console.log(id);
        this.budgetComponent.changeBudgetStatus(id, status, this.btc);
    }
    
    addBudgetItem(id: string, item: string, valorUnitario: string){
        var self = this;
        console.log("entrou no addbudgeitem");
        if(self.bnc){
            console.log("Entrou no if linha 58");
            self.bnc.setValue();
        } else if(self.budgetEdit){
            console.log("Entrou no else if linha 60");
            self.budgetEdit.setValue();
        }
        
        this.comodos.forEach(function(comodo){
            console.log("entrou no for each");
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
            console.log("Entrou no if");
           self.budgetComponent.addItemBudget(self.b, self.bnc);
        }else if(self.budgetEdit){
            console.log("Entrou no else if");
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
    
    removeItem(i: number){
        if(this.budgetEdit){
            this.budgetEdit.removeItem(i);
        }else if(this.bnc){
            this.bnc.removeItem(i);
        }
        
    }
    
    changeItem(i: number){
        if(this.budgetEdit){
            this.budgetEdit.changeItemBudget(i);
        }else if(this.bnc){
            this.bnc.changeItemBudget(i);
        }
        
    }
    
    eventRow(i:number, data: string){
        if(this.runClickRow && data['item'] != "LINHA DE SEPARAÇÃO"){
            this.selectedRow = i;
            if(!this.multipleRowsSelection){
                console.log("1");
                this.selectedRows = [];
            }
            if(this.selectedRows.indexOf(i) != -1){
                console.log("2");
                this.selectedRows = this.selectedRows.slice(0,this.selectedRows.indexOf(i)).concat(this.selectedRows.slice(this.selectedRows.indexOf(i)+1,this.selectedRows.length));
                //this.selectedRows = this.selectedRows.splice(this.selectedRows.indexOf(i));
            } else{
                console.log("3");
                this.selectedRows.push(i);
            }
            
            if(this.changeItemTable){
                if(this.bnc){
                    this.bnc.clickRowChangeItem(data['descricao']);
                }else if(this.budgetEdit){
                    this.budgetEdit.clickRowChangeItem(data['descricao']);
                }
            } else{
                if(this.bnc){
                    console.log("bnc");
                    this.bnc.clickRow(i);
                }else if(this.itemButton){
                    console.log("itemButton");
                    this.budgetItem.clickRow(i);
                }else if(this.budgetEdit){
                    console.log("budgetEdit");
                    this.budgetEdit.clickRow(i);
                }else if(this.soc){
                    this.soc.clickRow(this.selectedRows);
                }else if(this.fdc){
                    if(!this.drawTable){
                        console.log("FDC");
                        if(!this.fdcMaterial){
                            this.fdc.clickRow(i);
                        } else{
                            this.fdc.clickRowMaterial(i);
                        }
                    } else{
                        this.fdc.clickRowDraw(i);
                    }
                }else if(this.mc){
                    console.log("MC");
                    this.mc.clickRow(i);
                }
            }
            this.currentLine = i;
        }
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
        this.start.start();
        this.orderForm = this.formBuilder.group({
            checkBoxOption: this.buildComodos()
        })
        if(this.soc){
            if(this.formGroupSO){
                this.releseSoc = true;
                console.log(this.formGroupSO);
            }
            
        }
    }
}
