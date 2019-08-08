import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AppService} from '../app.service'
import {PeopleModel} from './people.model';

@Component({
  selector: 'sivp-comp',
  templateUrl: './comp.component.html',
  styleUrls: ['./comp.component.css']
})
export class CompComponent implements OnInit{
    constructor(private appService: AppService){}
    
    people: Object[] = [];
    peopleType = {DTYPE: '', bairro: '', celular: '', celular2: '', cidade: '', cnpj: '', complemento: '', cpf: '', email: '', endereco: '', enderecoObra: '', id: 0, nome: '', telefone: '', telefone2: ''};
    peopleVector:  PeopleModel[] = [];
    
    
    ngOnInit() {
            var self = this;
           this.appService.searchAllPeople().subscribe(function(data){
                console.log(data);
                data.forEach(function(value){
                    self.peopleType = Object.assign(self.peopleType, value);
                    self.peopleVector.push(self.peopleType);
                    
                    self.peopleType = {DTYPE: '', bairro: '', celular: '', celular2: '', cidade: '', cnpj: '', complemento: '', cpf: '', email: '', endereco: '', enderecoObra: '', id: 0, nome: '', telefone: '', telefone2: ''};
                });
               console.log(self.peopleVector);
               self.peopleVector.forEach(function(value){
                   self.appService.clientStoreInsertion(value.bairro,
                    value.celular,
                    value.celular2,
                    value.cidade,
                    value.complemento,
                    value.email,
                    value.endereco,
                    value.nome,
                    value.telefone,
                    value.telefone2,
                    "Belartte",).subscribe(function(data){
                     console.log(data); 
                  });
               });
           });
    }
}