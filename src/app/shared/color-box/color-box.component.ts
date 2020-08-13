import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sivp-color-box',
  templateUrl: './color-box.component.html',
  styleUrls: ['./color-box.component.css']
})
export class ColorBoxComponent implements OnInit {

  constructor() { }
    
    @Input() size: string = 'col-md-6 col-sm-6 col-xs-12';
    @Input() color: string = 'blue';
    @Input() icon: string = 'fa fa-pencil';
    @Input() title: string = '';
    @Input() content: string = '';
    @Input() href: string = '';
    
    ngOnInit() {
        this.color = 'info-box bg-' + this.color;  
    }
}
