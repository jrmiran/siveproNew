import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {AppService} from '../app.service';
import {RadioOption} from '../shared/radio/radio-option.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-seller-register',
  templateUrl: './seller-register.component.html',
  styleUrls: ['./seller-register.component.css']
})
export class SellerRegisterComponent implements OnInit {

  constructor(private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }
    
    sellerForm: FormGroup;
    clientsJuridicoObj: Object[];
    loadPage: boolean = false;
    
    insertSeller(){
        var self = this;
        this.spinner.show();
        this.appService.sellerInsertion(this.sellerForm.get('txtCel1').value,
                                       this.sellerForm.get('txtCel2').value,
                                       this.sellerForm.get('txtEmail').value,
                                       this.sellerForm.get('txtName').value,
                                       this.sellerForm.get('txtTel1').value,
                                       this.sellerForm.get('txtTel2').value,
                                       this.sellerForm.get('txtStore').value).subscribe(function(data){
            console.log(data);
            self.spinner.hide();
            alert("Vendedor Cadastrado com Sucesso!");
            self.cleanFields();
        });
    }
    
    cleanFields(){
        var self = this;
        self.sellerForm.get('txtCel1').setValue("");
        self.sellerForm.get('txtCel2').setValue("");
        self.sellerForm.get('txtName').setValue("");
        self.sellerForm.get('txtTel1').setValue("");
        self.sellerForm.get('txtTel2').setValue("");
        self.sellerForm.get('txtEmail').setValue("");
        self.sellerForm.get('txtStore').setValue("");
    }
    
    ngOnInit() {
        var self = this;
        
        setTimeout(()=> this.spinner.show(), 10);
        
        this.appService.clientsJuridico().subscribe(function(clientsJuridico){
                    self.clientsJuridicoObj = clientsJuridico;
                    self.loadPage = true;
                    self.spinner.hide();
        });
        
        this.sellerForm = this.formBuilder.group({
            txtStore: this.formBuilder.control('', [Validators.required]),
            txtName: this.formBuilder.control('',[Validators.required]),
            txtEmail: this.formBuilder.control('',[Validators.email]),
            txtCel1: this.formBuilder.control(''),
            txtCel2: this.formBuilder.control(''),
            txtTel1: this.formBuilder.control(''),
            txtTel2: this.formBuilder.control(''),
        });
        
        
    }
}
