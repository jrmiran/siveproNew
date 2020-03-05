import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sivp-primary-box',
  templateUrl: './primary-box.component.html',
  styleUrls: ['./primary-box.component.css']
})
export class PrimaryBoxComponent implements OnInit {

  constructor() { }
    @Input() title: string;
    @Input() size: string = "col-sm-6 col-xs-12";
    @Input() icon: string = "fa fa-pencil";
    

  ngOnInit() {
  }

}