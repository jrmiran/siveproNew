import {Injectable} from "@angular/core";
import {DATA_API} from "./app.api";
import {DATA_API2} from "./app.api2";
import { Http, RequestOptions, Headers } from "@angular/http";
import { HttpHeaders, HttpClient, HttpErrorResponse  } from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/catch';
import {BudgetInsertion} from './budget/budget-insertion.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AppService{
    constructor(private http: Http, private router: Router){}
    
    released: boolean = false;
    
    callQuery(q: string): Observable<Object[]>{
        var self = this;
        console.log(`${DATA_API}/` + q);
        return this.http.get(`${DATA_API}/` + q).map(response => response.json()).catch(function(err: HttpErrorResponse){
            if(err.status > 0){
                return self.callQuery2(q);
            } else{
                return Observable.throw(err);
            }
            
        });
    }
    
    callQuery2(q: string): Observable<Object[]>{
        return this.http.get(`${DATA_API2}/` + q).map(response => response.json()).catch(function(err: HttpErrorResponse){
            return Observable.throw(err);
        });
    }
    
    callPost(q: string, obj: any): Observable<Object[]>{
        var self = this;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(`${DATA_API}/` + q);
        console.log(obj);
        return this.http.post(`${DATA_API}/` + q, obj, {headers: headers}).map(response => response.json()).catch(function(err: HttpErrorResponse){
            if(err.status >  0){
                return self.callPost2(q, obj);
            } else{
                return Observable.throw(err);
            }
            
        });
    }
    
    callPost2(q: string, obj: any): Observable<Object[]>{
        var self = this;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(`${DATA_API2}/` + q);
        console.log(obj);
        return this.http.post(`${DATA_API2}/` + q, obj, {headers: headers}).map(response => response.json()).catch(function(err: HttpErrorResponse){
                return Observable.throw(err);
        });
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
    
    authentication(user: string, password: string): Observable<Object[]>{
        return this.callQuery(`authentication/'${user}'/'${password}'`);
    }
    
    thirdyBudget(store: string, thirdy: string): Observable<Object[]>{
        console.log(store, thirdy);
        return this.callQuery(`budgetClient/${store}/${thirdy}`);
    }
    
    updateBudgetItem(id: number, description: string, value:string): Observable<Object[]>{
        return this.callQuery(`updateItem/${id}/'${description}'/'${value}'`);
    }
    
    createBudgetItem(id: number, description: string, value:string): Observable<Object[]>{
        return this.callQuery(`createItem/${id}/'${description}'/'${value}'`);
    }
    
    insertImageSO(id:number, imageUrl: string): Observable<Object[]>{
        return this.callQuery(`insertImageSO/${id}/'${imageUrl}'`);
    }
    
    insertImageSO2(id:number, imageUrl: any): Observable<Object[]>{
        return this.callQuery(`insertImageSO/${id}/'${imageUrl}'`);
    }
    
    
    materials(): Observable<Object[]>{
        return this.callQuery("materials");
    }
    
    
    clientInsertion(
                    clientType: string,
                    clientNeighbor: string,
                    clientCel1:string,
                    clientCel2: string,
                    clientCity: string,
                    clientComplement: string,
                    clientAddress: string,
                    clientName: string,
                    clientTel1: string,
                    clientTel2: string,
                    clientCpf: string,
                    clientEmail: string,
                    clientCnpj: string,
    ): Observable<Object[]>{
        return this.callQuery(`clientInsertion/'${clientType}'/'${clientNeighbor}'/'${clientCel1}'/'${clientCel2}'/'${clientCity}'/'${clientComplement}'/'${clientAddress}'/'${clientName}'/'${clientTel1}'/'${clientTel2}'/'${clientCpf}'/'${clientEmail}'/'${clientCnpj}'`);
    }
    
    clientStoreInsertion(
                    clientNeighbor: string,
                    clientCel1:string,
                    clientCel2: string,
                    clientCity: string,
                    clientComplement: string,
                    clientEmail: string,
                    clientAddress: string,
                    clientName: string,
                    clientTel1: string,
                    clientTel2: string,
                    storeName: string,
    ): Observable<Object[]>{
        return this.callQuery(`clientStoreInsertion/'${clientNeighbor}'/'${clientCel1}'/'${clientCel2}'/'${clientCity}'/'${clientComplement}'/'${clientEmail}'/'${clientAddress}'/'${clientName}'/'${clientTel1}'/'${clientTel2}'/'${storeName}'`);
    }
    
    sellerInsertion(
                    clientCel1:string,
                    clientCel2: string,
                    clientEmail: string,
                    clientName: string,
                    clientTel1: string,
                    clientTel2: string,
                    storeName: string,
    ): Observable<Object[]>{
        return this.callQuery(`sellerInsertion/'${clientCel1}'/'${clientCel2}'/'${clientEmail}'/'${clientName}'/'${clientTel1}'/'${clientTel2}'/'${storeName}'`);
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
    
    budgetUpdate(   id: number,
                    discount: number,
                    note: string,
                    retified: number,
                    amount: number,
                    codes: string, 
                    ambients: string, 
                    details: string,
                    items: string,
                    measures: string,
                    needings: string,
                    numbers: string,
                    quantitys: string,
                    values: string){
        return this.callQuery(`budgetUpdate/${id}/${discount}/${note}/${retified}/${amount}/${codes}/${ambients}/${details}/${items}/${measures}/${needings}/${numbers}/${quantitys}/${values}`);
    }
    
    budgetInsertionTest(insertion: string){
        return this.callQuery(`budgetInsertionTest/${insertion}`);
    }
    
    budgetEdit(id: number){
        return this.callQuery(`budgetEdit/${id}`);
    }
    
    budgetExplosion(): Observable<Object[]>{
        return this.callQuery("budgetExplosion");
    }
    
    searchAllPeople(): Observable<Object[]>{
        return this.callQuery('searchAllPeople');
    }
    
    editBudgetStatus(id: any, status:  boolean): Observable<Object[]>{
        return this.callQuery(`statusBudget/${id}/${status}`);
    }
    
    budget(id: any): Observable<Object[]>{
        return this.callQuery(`budget/${id}`);
    }
    
    serviceOrder(budgetId: any): Observable<Object[]>{
        return this.callQuery(`serviceOrder/${budgetId}`);
    }
    
     serviceOrderId(soId: any): Observable<Object[]>{
        return this.callQuery(`serviceOrderId/${soId}`);
    }
    
    serviceOrderInsertion(client: string, detail: string, ambient: string, item: string, store: string, measure: string, note: string, value: number, seller: string, budgetId: number, stone: boolean): Observable<Object[]>{
        return this.callQuery(`serviceOrderInsertion/'${client}'/'${detail}'/'${ambient}'/'${item}'/'${store}'/'${measure}'/'${note}'/${value}/'${seller}'/${budgetId}/${stone}`);
    }
    
    searchAllServiceOrders(): Observable<Object[]>{
        return this.callQuery(`searchAllServiceOrder`);
    }
    
    insertSOExecution(id: number, date: string, stone: any, empreita: any, stoneValue: string, employees: string, shares: string, empreitaValue: string): Observable<Object[]>{
        return this.callQuery(`soExecution/${id}/'${date}'/${stone}/${empreita}/'${stoneValue}'/${employees}/${shares}/${empreitaValue}`);
    }
    
    searchAllEmployees(): Observable<Object[]>{
        return this.callQuery(`searchAllEmployees`);
    }
    
    serviceOrderBudget(idSO: number): Observable<Object[]>{
        return this.callQuery(`serviceOrderBudget/${idSO}`);
    }
    
    findBudgetItems(budgetId: number): Observable<Object[]>{
        return this.callQuery(`findBudgetItems/${budgetId}`);
    }
    
    postTest(obj: any): Observable<Object[]>{
        return this.callPost(`postTest`, obj);
    }
    
    postPayment(obj: any): Observable<Object[]>{
        return this.callPost(`postPayment`, obj);
    }
    
    postBudgetUpdate(obj: any): Observable<Object[]>{
        return this.callPost(`postBudgetUpdate`, obj);
    }
    
    postInsertBudgetItems(obj: any): Observable<Object[]>{
        return this.callPost(`postInsertBudgetItems`, obj);
    }
    
    insertMaterial(obj: any): Observable<Object[]>{
        return this.callPost(`postInsertMaterial`, obj);
    }
    
    postUpdateBudgetItem(obj: any): Observable<Object[]>{
        return this.callPost(`postUpdateBudgetItem`, obj);
    }
    
    
    draw(budgetId: number): Observable<Object[]>{
        return this.callQuery(`draw/${budgetId}`);
    }
    
    deleteBudgetItem(itemId: any): Observable<Object[]>{
        return this.callQuery(`deleteBudgetItem/${itemId}`);
    }
    
    insertDraw(obj: any): Observable<Object[]>{
        return this.callPost(`postInsertDraw`, obj);
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
    
    checkSessionStorage(localStorageName: string): boolean{
        if(window.sessionStorage.getItem(localStorageName) == "true"){
            return true;
        } else{
            return false;
        }
    }
    
    loadPage(){
        if(!this.checkSessionStorage('authenticated')){
            this.router.navigate(['login']);
        }
    }
}
