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
    selectedMaterial= {} as any;
    modalType: string = "";
    modalTitle: string = "";
    
    clickRow(i: number){
        
    }
    
    openModalAddMaterial(){
        this.modalType = "New";
        this.modalTitle = "Novo Material";
        
        this.formMaterial.get('txtName').setValue("");
        this.formMaterial.get('txtBrand').setValue("");
        this.formMaterial.get('txtComercialSize').setValue("");
        this.formMaterial.get('txtRealSize').setValue("");
        this.formMaterial.get('txtValue').setValue("");
        this.formMaterial.get('cmbUnit').setValue("");
        
        document.getElementById('openModalButton').click();
    }
    
    openEditMaterialModal(id: any){
        this.selectedMaterial = this.materials.find((v)=>{
            return v['id'] == id;
        })
        this.modalTitle = "Edição de Material \nId: " + id;
        this.modalType = "Edit";
        
        this.formMaterial.get('txtName').setValue(this.selectedMaterial['nome']);
        this.formMaterial.get('txtBrand').setValue(this.selectedMaterial['marca']);
        this.formMaterial.get('txtComercialSize').setValue(this.selectedMaterial['tamanhoComercial']);
        this.formMaterial.get('txtRealSize').setValue(this.selectedMaterial['tamanhoReal']);
        this.formMaterial.get('txtValue').setValue(parseFloat(this.selectedMaterial['valor']));
        this.formMaterial.get('cmbUnit').setValue(this.selectedMaterial['unidade']);
        document.getElementById('openModalButton').click();
        
    }
    
    processMaterial(event: any){
        this.spinner.show();
        var obj = {name: this.formMaterial.get('txtName').value, comercialSize: this.formMaterial.get('txtComercialSize').value, realSize: this.formMaterial.get('txtRealSize').value, brand: this.formMaterial.get('txtBrand').value.toString().toUpperCase(), value: this.formMaterial.get('txtValue').value, unit: this.formMaterial.get('cmbUnit').value, id: this.selectedMaterial['id']};
        if(this.modalType == "Edit"){
            this.editMaterial(obj);
        }else if(this.modalType == "New"){
            this.insertMaterial(obj);
        }
        
    }
    
    insertMaterial(obj: any){
        this.appService.insertMaterial(obj).subscribe((data)=>{
            alert("Material Inserido");
            this.appService.materials().subscribe((v)=>{
                this.materials = v;
                this.spinner.hide();
            });
        })
    }
    
    editMaterial(obj: any){
        this.appService.postEditMaterial(obj).subscribe((data)=>{
            alert("Material Editado");
            this.appService.materials().subscribe((v)=>{
                this.materials = v;
                this.spinner.hide();
            });
        })
    }
    
    ngOnInit() {
        this.spinner.show();
        this.self = this;
        var self = this;
        this.formMaterial = this.formBuilder.group({
            txtName: this.formBuilder.control('', [Validators.required]),
            txtComercialSize: this.formBuilder.control(''),
            txtRealSize: this.formBuilder.control(''),
            txtValue: this.formBuilder.control('', [Validators.required]),
            cmbUnit: this.formBuilder.control('', [Validators.required]),
            txtBrand: this.formBuilder.control('')
        });

        this.appService.materials().subscribe(function(data){
            self.materials = data;
            self.spinner.hide();
        });
    }
}