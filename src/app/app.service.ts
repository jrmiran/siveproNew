import {Injectable} from "@angular/core";
import {DATA_API} from "./app.api";
import { Http } from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {BudgetInsertion} from './budget/budget-insertion.model';

@Injectable()
export class AppService{
    constructor(private http: Http){}
    
    callQuery(q: string): Observable<Object[]>{
        console.log(`${DATA_API}/` + q);
        return this.http.get(`${DATA_API}/` + q).map(response => response.json());
    }
    
    budgets(): Observable<Object[]>{
        return this.callQuery("query");
    }
    
    budgetItems(): Observable<Object[]>{
        return this.callQuery("items");
    }
    
    clientsJuridico(): Observable<Object[]>{
        return this.callQuery("clientsJuridico");
    }
    
    clientsFisico(): Observable<Object[]>{
        return this.callQuery("clientsFisico");
    }
    
    clientsArquiteto(): Observable<Object[]>{
        return this.callQuery("clientsArquiteto");
    }
    
    clientsEmpresa(value: string): Observable<Object[]>{
        return this.callQuery(`clientEmpresa/${value}`);
    }
    
    vendorEmpresa(value: string): Observable<Object[]>{
        return this.callQuery(`vendor/${value}`);
    }
    
    clientBudget(store: string, vendor: string): Observable<Object[]>{
        console.log(store, vendor);
        return this.callQuery(`budgetVendor/${store}/${vendor}`);
    }
    
    thirdyBudget(store: string, thirdy: string): Observable<Object[]>{
        console.log(store, thirdy);
        return this.callQuery(`budgetClient/${store}/${thirdy}`);
    }
    
    updateBudgetItem(id: number, description: string, value:string): Observable<Object[]>{
        return this.callQuery(`updateItem/${id}/'${description}'/'${value}'`);
    }
    
    budgetInsertion(
                    codes: string, 
                    ambients: string, 
                    details: string,
                    items: string,
                    measures: string,
                    needings: string,
                    numbers: string,
                    quantitys: string,
                    values: string,
                    insertion: string){
        return this.callQuery(`budgetInsertion/${codes}/${ambients}/${details}/${items}/${measures}/${needings}/${numbers}/${quantitys}/${values}/${insertion}`);
    }
    
    budgetInsertionTest(insertion: string){
        return this.callQuery(`budgetInsertionTest/${insertion}`);
    }
    
    converteFloatMoeda(valor: any){
      var inteiro = null, decimal = null, c = null, j = null;
      var aux = new Array();
      valor = ""+valor;
      c = valor.indexOf(".",0);
      //encontrou o ponto na string
      if(c > 0){
         //separa as partes em inteiro e decimal
         inteiro = valor.substring(0,c);
         decimal = valor.substring(c+1,valor.length);
      }else{
         inteiro = valor;
      }
      
      //pega a parte inteiro de 3 em 3 partes
      for (j = inteiro.length, c = 0; j > 0; j-=3, c++){
         aux[c]=inteiro.substring(j-3,j);
      }
      
      //percorre a string acrescentando os pontos
      inteiro = "";
      for(c = aux.length-1; c >= 0; c--){
         inteiro += aux[c]+'.';
      }
      //retirando o ultimo ponto e finalizando a parte inteiro
      
      inteiro = inteiro.substring(0,inteiro.length-1);
      
      decimal = parseInt(decimal);
      if(isNaN(decimal)){
         decimal = "00";
      }else{
         decimal = ""+decimal;
         if(decimal.length === 1){
            decimal = decimal+"0";
         }
      }
      
      
      valor = "R$ "+inteiro+","+decimal;
      
      
      return valor;

   }
    
    converteMoedaFloat(value: any): number{
         var valor = value.toString();
         valor = valor.replace("R$ ","");
         valor = valor.replace(".","");
         valor = valor.replace(",",".");
         return parseFloat(valor);
    }

}
