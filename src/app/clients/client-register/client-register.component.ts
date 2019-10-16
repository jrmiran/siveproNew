import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {AppService} from '../../app.service';
import {RadioOption} from '../../shared/radio/radio-option.model';
import {NgxSpinnerService} from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sivp-client-register',
  templateUrl: './client-register.component.html',
  styleUrls: ['./client-register.component.css']
})
export class ClientRegisterComponent implements OnInit {

    constructor(private appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private route: ActivatedRoute) { }
    
    clientForm: FormGroup;
    typeClient: string;
    clientsJuridicoObj: Object[];
    clientId = "";
    nameStore = "";
    editClient: boolean = false;
    
    tipoCliente: RadioOption[] = [
        {label: 'Loja', value: 'LOJ'},
        {label: 'Cliente Físico', value: 'FIS'},
        {label: 'Arquiteto', value: 'ARQ'},
        {label: 'Cliente Loja', value: 'CLOJ'}
    ];
    clientData: Object[] = [];
    
    insertClient(){
        var self = this;
        setTimeout(()=>{this.spinner.show()}, 1000);
        if(this.typeClient != "Cliente Loja"){
            this.appService.clientInsertion(this.typeClient,
                                            this.clientForm.get('txtNeighbor').value,
                                            this.clientForm.get('txtCel1').value,
                                            this.clientForm.get('txtCel2').value,
                                            this.clientForm.get('txtCity').value,
                                            this.clientForm.get('txtComplement').value,
                                            this.clientForm.get('txtAddress').value,
                                            this.clientForm.get('txtName').value,
                                            this.clientForm.get('txtTel1').value,
                                            this.clientForm.get('txtTel2').value,
                                            this.clientForm.get('txtCPF').value,
                                            this.clientForm.get('txtEmail').value,
                                            this.clientForm.get('txtCNPJ').value)
                .subscribe(function(data){
                    console.log(data);
                    alert("Cliente Cadastrado Com Sucesso!");
                    self.cleanFields();
                    self.spinner.hide();
                });
        } else{
            this.appService.clientStoreInsertion(this.clientForm.get('txtNeighbor').value,
                                                this.clientForm.get('txtCel1').value,
                                                this.clientForm.get('txtCel2').value,
                                                this.clientForm.get('txtCity').value,
                                                this.clientForm.get('txtComplement').value,
                                                this.clientForm.get('txtEmail').value,
                                                this.clientForm.get('txtAddress').value,
                                                this.clientForm.get('txtName').value,
                                                this.clientForm.get('txtTel1').value,
                                                this.clientForm.get('txtTel2').value,
                                                this.clientForm.get('txtStore').value)
                .subscribe(function(data){
                    console.log(data);
                    alert("Cliente Cadastrado Com Sucesso!");
                    self.cleanFields();
                    self.spinner.hide();
                });
        }
    }
    
    updateClient(){
        var self = this;
        this.spinner.show();        
        var params = {id: this.clientId, neighbor: this.clientForm.get('txtNeighbor').value, cel: this.clientForm.get('txtCel1').value, cel2: this.clientForm.get('txtCel2').value, city: this.clientForm.get('txtCity').value, complement: this.clientForm.get('txtComplement').value, email: this.clientForm.get('txtEmail').value, address: this.clientForm.get('txtAddress').value, name: this.clientForm.get('txtName').value, tel: this.clientForm.get('txtTel1').value, tel2: this.clientForm.get('txtTel2').value, cpf: this.clientForm.get('txtCPF').value, cnpj: this.clientForm.get('txtCNPJ').value};
        
        this.appService.postUpdateClient(params).subscribe(function(data){
            alert("Cliente Atualizado Com Sucesso!");
            self.spinner.hide();
        })
    }
    
    cleanFields(){
        var self = this;
        self.clientForm.get('txtNeighbor').setValue("");
        self.clientForm.get('txtCel1').setValue("");
        self.clientForm.get('txtCel2').setValue("");
        self.clientForm.get('txtCity').setValue("");
        self.clientForm.get('txtComplement').setValue("");
        self.clientForm.get('txtAddress').setValue("");
        self.clientForm.get('txtName').setValue("");
        self.clientForm.get('txtTel1').setValue("");
        self.clientForm.get('txtTel2').setValue("");
        self.clientForm.get('txtCPF').setValue("");
        self.clientForm.get('txtEmail').setValue("");
        self.clientForm.get('txtCNPJ').setValue("");
    }
    

    validateField(){
        var self = this;
        this.cleanFields();
        if(this.clientForm.get('rdTypeClient').value == 'LOJ'){
            this.typeClient = "ClienteJuridico";
            self.clientForm.get('rdTypeClient').setValidators(null);
        }else if(this.clientForm.get('rdTypeClient').value == 'FIS'){
            this.typeClient = "Pessoa";
            self.clientForm.get('rdTypeClient').setValidators(null);
        }else if(this.clientForm.get('rdTypeClient').value == 'ARQ'){
            this.typeClient = "Arquiteto";
            self.clientForm.get('rdTypeClient').setValidators(null);
        }else if(this.clientForm.get('rdTypeClient').value == 'CLOJ'){
            if (!this.clientsJuridicoObj){
                this.spinner.show();
                this.appService.clientsJuridico().subscribe(function(clientsJuridico){
                    self.clientsJuridicoObj = clientsJuridico;
                    self.typeClient = "Cliente Loja";
                    self.clientForm.get('rdTypeClient').setValidators([Validators.required]);
                    self.spinner.hide();
                });
            } else{
                self.typeClient = "Cliente Loja";
            }
        }
    }
    
    setValidator(){
        var self = this;
        this.clientForm.get('rdTypeClient').valueChanges.subscribe(typeClient=>{
            /*onsole.log(typeClient);
            if (typeClient == 'CLOJ'){
                self.clientForm.get('rdTypeClient').setValidators([Validators.required]);
            } else{
                self.clientForm.get('rdTypeClient').setValidators(null);
            }
            self.clientForm.get('rdTypeClient').updateValueAndValidity();*/

        });
    }
    
    ngOnInit() {
        var self = this;
        
        this.clientForm = this.formBuilder.group({
            txtStore: this.formBuilder.control(''),
            txtName: this.formBuilder.control('',[Validators.required]),
            txtEmail: this.formBuilder.control('',[Validators.email]),
            txtCPF: this.formBuilder.control(''),
            txtCNPJ: this.formBuilder.control(''),
            txtCel1: this.formBuilder.control(''),
            txtCel2: this.formBuilder.control(''),
            txtTel1: this.formBuilder.control(''),
            txtTel2: this.formBuilder.control(''),
            txtAddress: this.formBuilder.control(''),
            txtComplement: this.formBuilder.control(''),
            txtCity: this.formBuilder.control(''),
            txtNeighbor: this.formBuilder.control(''),
            rdTypeClient: this.formBuilder.control('',[Validators.required]),
        });
        
        if(this.route.queryParams['value']['id'] > 0){
            self.clientId = self.route.queryParams['value']['id'];
            self.nameStore = self.route.queryParams['value']['nameStore'];
            self.editClient = true;
            this.appService.postSearchClient(this.route.queryParams['value']).subscribe(function(data){
                console.log(data);
                self.clientForm.get('txtStore').setValue(self.route.queryParams['value']['nameStore']);
                self.clientForm.get('txtName').setValue(data[0]['nome']);
                self.clientForm.get('txtEmail').setValue(data[0]['email']);
                self.clientForm.get('txtCPF').setValue(data[0]['cpf']);
                self.clientForm.get('txtCNPJ').setValue(data[0]['cnpj']);
                self.clientForm.get('txtCel1').setValue(data[0]['celular']);
                self.clientForm.get('txtCel2').setValue(data[0]['celular2']);
                self.clientForm.get('txtTel1').setValue(data[0]['telefone']);
                self.clientForm.get('txtTel2').setValue(data[0]['telefone2']);
                self.clientForm.get('txtAddress').setValue(data[0]['endereco']);
                self.clientForm.get('txtComplement').setValue(data[0]['complemento']);
                self.clientForm.get('txtCity').setValue(data[0]['cidade']);
                self.clientForm.get('txtNeighbor').setValue(data[0]['bairro']);
            });
        }
        
        this.setValidator();
    }
}