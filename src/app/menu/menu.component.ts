import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sivp-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

    userName: string;
    
  ngOnInit() {
    this.userName = window.sessionStorage.getItem('user');  
  }

}
