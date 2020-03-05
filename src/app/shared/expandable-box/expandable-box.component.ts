import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sivp-expandable-box',
  templateUrl: './expandable-box.component.html',
  styleUrls: ['./expandable-box.component.css']
})
export class ExpandableBoxComponent implements OnInit {

  constructor() { }
    
    @Input() title: string = "";
    @Input() size: string = "col-sm-12 col-xs-12";
    @Input() icon: string = "fa fa-pencil";
    
  ngOnInit() {
  }

}
