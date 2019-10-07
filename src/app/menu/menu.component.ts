import { Component, OnInit } from '@angular/core';
import {ParameterService} from '../shared/parameter.service';

@Component({
  selector: 'sivp-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private parameterService: ParameterService) { }

    userName: string;
    privilege: boolean = false;
    administrator: boolean = false;

  ngOnInit() {
        this.userName = window.sessionStorage.getItem('user');  
        if(window.sessionStorage.getItem('administrator') == "1"){
            this.administrator = true;
            console.log(this.administrator);
        }
        if(window.sessionStorage.getItem('privilege') == "1"){
            this.privilege = true;
            console.log(this.privilege);
        }
        
  }

}