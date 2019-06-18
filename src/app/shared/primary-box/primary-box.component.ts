import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sivp-primary-box',
  templateUrl: './primary-box.component.html',
  styleUrls: ['./primary-box.component.css']
})
export class PrimaryBoxComponent implements OnInit {

  constructor() { }
    @Input() title: string;

  ngOnInit() {
  }

}
