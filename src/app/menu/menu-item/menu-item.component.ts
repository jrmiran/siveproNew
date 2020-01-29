import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sivp-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {
    
    @Input() name: string;
    @Input() subItems: string[];
    @Input() routers: string[];
    userName: string;
    privilege: boolean = false;
    administrator: boolean = false;
    
    
    showItem(subItem: string): boolean{
        if(this.name == "Ordem de Serviço" && subItem == "Relatório" && !this.privilege){
           return false;
        }else{
            return true;
        }
    }
    
  constructor() { }

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
