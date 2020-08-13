import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BudgetTableComponent} from '../../budget/budget-table/budget-table.component';

@Component({
  selector: 'sivp-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent implements OnInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService) { }

    clients: Object[] = [];
    self = this;
    
    openBudgetsClient(id: number){
        this.appService.postBudgetsClient({clientId: id}).subscribe(function(data){
            
        });
    }
    
    ngOnInit() {
        var self = this;
        setTimeout(()=>{this.spinner.show()}, 1000);
        this.appService.postSearchClients().subscribe(function(data){
            console.log(data);
            self.clients = data; 
            setTimeout(()=>{self.spinner.hide()}, 1000);
        });
    }
}