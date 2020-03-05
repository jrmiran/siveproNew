import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import {AppService} from '../../app.service';
import {NewRequestComponent} from '../new-request/new-request.component';
import {EditRequestComponent} from '../edit-request/edit-request.component';

@Component({
  selector: 'sivp-request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit {

    constructor(private appService: AppService) { }

    @Input() headers: string[];
    @Input() datas: Object[];
    @Input() idItemBudget: string[];
    @Input() nrc: NewRequestComponent;
    @Input() erc: NewRequestComponent;
    
    deleteItemBudget(budgetId: any, itemId: any){
        if(this.nrc){
            this.nrc.removeItem(budgetId, itemId);
        }else if(this.erc){
            this.erc.removeItem(budgetId, itemId);
        }
    }
    eventRow(i:number, data: string){
        
    }
    
    
    ngOnInit() {
    }

}
