import { Component, OnInit, Input, Output, Injectable, EventEmitter } from '@angular/core';

@Component({
  selector: 'sivp-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent implements OnInit {
    @Input() id: string = "confirmation";
    @Input() title: string = "";
    @Input() icon: string = "";
    @Output() yesClick = new EventEmitter();
    @Output() noClick = new EventEmitter();
    
    yesClicked() { 
       this.yesClick.emit();
    }
    noClicked() { 
       this.noClick.emit();
    }
    
    constructor() { }

    ngOnInit() {
    }
}
