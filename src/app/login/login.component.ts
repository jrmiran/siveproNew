import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service'
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/user/user-model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'sivp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup
  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private spinner: NgxSpinnerService) { }
    user: Object[] = [];
    userName= {nome:""};
    
    registerUser(){
        var self = this;
        setTimeout(()=> this.spinner.show(), 10);
        this.appService.authentication(this.loginForm.get('email').value, this.loginForm.get('password').value).subscribe(function(data){
            console.log(data);
            self.user = data;
            if(self.user.length > 0){
                console.log(data[0]);
                self.userName = Object.assign(self.userName, data[0]);
                self.router.navigate(['comp']);
                window.sessionStorage.setItem('authenticated', 'true');
                window.sessionStorage.setItem('user', self.userName.nome);
            } else{
                console.log("else");
                alert("Usuário e/ou senha inválido");
            }
            self.spinner.hide();
        });
        
    }
    
    
  ngOnInit() {
      var self = this;
      if(this.appService.checkSessionStorage('authenticated')){
         self.router.navigate(['comp']);
      }
      this.loginForm = this.fb.group({
          email: this.fb.control('', [Validators.required, Validators.email]),
          password: this.fb.control('', [Validators.required])
      })
  }   
}