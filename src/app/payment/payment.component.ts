import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private appService: AppService, private spinner: NgxSpinnerService) { }
    
    payments: Object[] = [];
    self: any = this;
    
  ngOnInit() {
      var self = this;
      setTimeout(()=> {self.spinner.show();}, 100)
      self.appService.postPayment({}).subscribe(function(data){
          self.payments = data;
          self.payments.map(function(value){
              if(value['entrada']['data'][0] ==  1){
                  value['entrada'] = true;
              }else{
                  value['entrada'] = false;
              }
          })
          console.log(self.payments);
          self.spinner.hide();
      });
  }
}
