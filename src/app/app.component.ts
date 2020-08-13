import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service'

@Component({
  selector: 'sivp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'sivepro';
    constructor(public appService: AppService){}
    released: string;

    ngOnInit(){
       window.addEventListener("beforeunload", function (e) {
        alert("saindo...");
    });
    }
}