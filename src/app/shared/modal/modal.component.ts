import { Component, OnInit, Input, Output, Injectable, EventEmitter } from '@angular/core';


@Component({
  selector: 'sivp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
    @Input() id: string = "modal";
    @Input() title: string = "";
    @Input() icon: string = "";
    @Input() enableOkButton: boolean = true;
    @Input() outOnClick: boolean = true;
    @Output() okClick = new EventEmitter();
    
    okClicked() { 
       this.okClick.emit();
    }
    
    constructor() { }

    ngOnInit() {
    }
}
