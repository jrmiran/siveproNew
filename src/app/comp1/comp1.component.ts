import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css']
})
export class Comp1Component implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

    showSpinner(){
        this.spinner.show();
    }
  ngOnInit() {
      //this.spinner.show();
  } 
}