import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import {CreatePdfSOComponent} from '../create-pdf-so/create-pdf-so.component';
import {AppService} from '../app.service';
import {BudgetItem} from '../budget/budget-item.model'

@Component({
  selector: 'sivp-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit {

  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute, private appService: AppService) { }
    id: any;
    createPdf = new CreatePdfSOComponent(this.appService);
    budgetItens: BudgetItem[] = [];
    budgets: Object[] = [];
    params = {query:""};
    
    showSpinner(){
        this.spinner.show();
    }

    budgetExplosion(){
        var objs: Object[] = [];    
        var self = this;
        this.appService.budgetExplosion().subscribe(function(data){
                let discount = "0";
                console.log(data);
                objs = Object.assign(objs, data[2]);
                self.budgets = Object.assign(self.budgets, data[11]);
                
                
                objs.forEach(function(value, index){
                    
                    if(self.budgets.find(v => v['id'] == value['Orcamento_id'])['desconto']){
                        discount = self.budgets.find(v => v['id'] == value['Orcamento_id'])['desconto'];
                    } else{
                        discount = "0";
                    }
                    
                    let b = {} as BudgetItem;
                    b.budget = value['Orcamento_id'];
                    b.qtd = parseFloat(data[9][index]['quantidades'].replace(',','.'));
                    b.cod = data[3][index]['codigos'];
                    b.item = data[5][index]['itens'];
                    b.detail = data[4][index]['detalhes'];
                    b.measure = data[6][index]['medidas'];
                    b.ambient = data[2][index]['comodos'];
                    b.necessary = data[7][index]['necessidades'];
                    b.unitValue = data[10][index]['valores'].replace(',','.');
                    b.totalValue = (parseFloat(b.unitValue) * b.qtd).toFixed(2); //modificar
                    b.discount =  discount; //acrescentar orçamento à query
                    b.number = 0;
                    b.discountValue = ((parseFloat(b.totalValue) - (parseFloat(b.totalValue) * parseFloat(b.discount) / 100)).toFixed(2)); //modificar
                    self.budgetItens.push(b);
                });
                console.log(self.budgetItens);
                self.params.query = self.convertToQuery(self.budgetItens);
                console.log(self.params.query);
                console.log(self.budgetItens.find(v => v['budget'] == 766));
                self.appService.postInsertBudgetItems(self.params).subscribe(function(value){
                    console.log("DONE!");
                    console.log(value);
                });
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
    
    
    
  ngOnInit() {
      this.route.queryParams.subscribe(
        (queryParams: any) =>{
            console.log(queryParams);
            this.id = queryParams.id;
            console.log(this.id);
        }
      );
  }
}