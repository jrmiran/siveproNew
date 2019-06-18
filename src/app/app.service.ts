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
    
    /*clientBudget(store: string, vendor: string): Promise<any>{
        console.log(store, vendor);
        return this.http.get(`${DATA_API}/` + `budgetVendor/${store}/${vendor}`).toPromise().then(function(data){
            return data;
        });
    }*/
    
    thirdyBudget(store: string, thirdy: string): Observable<Object[]>{
        console.log(store, thirdy);
        return this.callQuery(`budgetClient/${store}/${thirdy}`);
    }
    
    /*thirdyBudget(store: string, thirdy: string): Promise<any>{
        console.log(store, thirdy);
        return this.http.get(`${DATA_API}/` + `budgetClient/${store}/${thirdy}`).toPromise().then(function(data){
            return data;
        });
    }*/
    
    budgetInsertion(codes: string, ambients: string, insertion: string){
        return this.callQuery(`budgetInsertion/${codes}/${ambients}/${insertion}`);
    }
}
