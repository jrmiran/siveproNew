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
    
  constructor() { }

  ngOnInit() {
  }

}
