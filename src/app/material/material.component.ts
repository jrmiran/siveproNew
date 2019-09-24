import { Component, OnInit } from '@angular/core';
import {Material} from './material.model';
import {AppService} from '../app.service'
import {NgxSpinnerService} from 'ngx-spinner';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';


@Component({
  selector: 'sivp-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {

    constructor(private appService: AppService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder) { }
    
    materials: Object[];
    self: any;
    formMaterial: FormGroup;
    
    clickRow(i: number){
        
    }
    
    openModalAddMaterial(){
        document.getElementById('openModalButton').click();
    }
    
    insertMaterial(){
        var obj = {name: this.formMaterial.get('txtName').value, comercialSize: this.formMaterial.get('txtComercialSize').value, realSize: this.formMaterial.get('txtRealSize').value};
        this.appService.insertMaterial(obj).subscribe(function(data){
            console.log(data);
            alert("Material Inserido");
        })
    }
    
    ngOnInit() {
        this.self = this;
        var self = this;
        this.formMaterial = this.formBuilder.group({
            txtName: this.formBuilder.control('', [Validators.required]),
            txtComercialSize: this.formBuilder.control(''),
            txtRealSize: this.formBuilder.control(''),
        });
        
        setTimeout(()=> this.spinner.show(), 10);
        this.appService.materials().subscribe(function(data){
            self.materials = data;
            self.spinner.hide();
        });
    }
}