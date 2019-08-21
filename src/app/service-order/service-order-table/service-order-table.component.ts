import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'sivp-service-order-table',
  templateUrl: './service-order-table.component.html',
  styleUrls: ['./service-order-table.component.css']
})
export class ServiceOrderTableComponent implements OnInit {

  constructor(private appService: AppService, public spinner: NgxSpinnerService) { }

    self = this;
    serviceOrders: Object[];
    id: number;
    openModal: Boolean;
    
    openModalFunction(open: boolean, id?: number){
        this.openModal = open;
        var self = this;
        
        if(open){
            this.id = id;
            
            console.log(id);
        }
    }
    
    ngOnInit() {
        setTimeout(()=> this.spinner.show(), 10);
        var self = this;
        
        this.appService.searchAllServiceOrders().subscribe(function(data){
            self.serviceOrders = data;
            self.serviceOrders.forEach(function(data){
                data['empreita'] =  data['empreita']['data'][0];
                data['pedra'] =  data['pedra']['data'][0];
            });
            self.spinner.hide();
        });
    }

}
