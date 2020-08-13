import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {Injectable} from "@angular/core";

@Injectable()
export class SpinnerService implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
      /** spinner starts on init */
    this.spinner.show();
 
    setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
    }, 5000);
  }
}