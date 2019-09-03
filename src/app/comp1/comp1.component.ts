import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import {CreatePdfSOComponent} from '../create-pdf-so/create-pdf-so.component';
import {AppService} from '../app.service';

@Component({
  selector: 'sivp-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit {

  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute, private appService: AppService) { }
    id: any;
    createPdf = new CreatePdfSOComponent(this.appService);
    
    showSpinner(){
        this.spinner.show();
    }
    
    geraPdf(){
        this.createPdf.gerarPDF();
    }
    
    objTest = {name: "Test1", number: "12", attribute3: "At3", attribute4: "at4"};
    postTest(){
        var json = JSON.stringify(this.objTest);
        console.log(JSON.stringify(this.objTest));
        this.appService.postTest(JSON.stringify({texto: "jefferson"})).subscribe(function(data){
           console.log(data);
        });    
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