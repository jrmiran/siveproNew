import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';
import {FormBuilder, FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {PayrollEmployee} from './payroll-employee.model';
import {PayrollPayment} from './payroll-payment.model';

@Component({
  selector: 'sivp-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {

    constructor(public appService: AppService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) { }
    
    // VARIABLES -------------
    main: any;
    spinnerText: string = 'Carregando ...';
    employees: Object[] = [];
    filteredEmployees: PayrollEmployee[] = [];
    payrollForm: FormGroup;
    typePayment: string[] = ['Vale', 'Salario', 'Vale Transporte', 'Empreita', 'Cesta', 'PLR', 'Comissão', 'Outros'];
    returnedForm: FormGroup;
    employeesForm: FormArray;
    release: boolean = false;
    headers: string[] = ['Nome', 'Vale', 'Salário', 'Vale Transporte', 'Empreita', 'Cesta', 'PLR', 'Comissão', 'Outros', 'Total'];
    filteredHeaders: string[] = ['Nome', 'Total'];
    formsName: string[] = ['advance', 'salary', 'transport', 'empreita', 'basket', 'sharing', 'comission', 'others'];
    filteredFormsName: string[] = [];
    totalPayroll: number = 0;
    payrollDate: string = "";
    payments: PayrollPayment[] = [];
    typePaymentDB: string[] = ['vale', 'Salário', 'vale transporte', 'empreita', 'cesta basica', 'PLR', 'comissao', 'gasto diversos com funcionarios'];
    // -----------------------
    
    //FUNÇÃO QUE RETORNA FORM DE CHECKBOX DE TIPOS DE PAGAMENTO -------------------------------------------
    buildCbType(){
        var cbType = this.formBuilder.array([]);
        this.typePayment.forEach((data)=>{
            cbType.push(new FormControl(false));
        })
        return cbType;
    }
    
    // ----------------------------------------------------------------------------------------------------
    
    
    // FUNÇÃO QUE CONSTRÓI ARRAY FORM ---------------------------------------------------------------------
    buildArrayForm(): Promise<any>{
        return new Promise((resolve, reject)=>{
            this.employeesForm = this.formBuilder.array([]);
            this.filteredEmployees.forEach((data)=>{
                this.employeesForm.push(new FormGroup({
                    advance: new FormControl(0, []),
                    salary: new FormControl(0, []),
                    transport: new FormControl(0, []),
                    empreita: new FormControl(0, []),
                    basket: new FormControl(0, []),
                    sharing: new FormControl(0, []),
                    comission: new FormControl(0, []),
                    others: new FormControl(0, [])
                }))
            })
            resolve('buildArrayForm executado com sucesso!');
            reject('buildArrayForm falhou!');
        });
    }
    
    // ----------------------------------------------------------------------------------------------------
    
    // FUNÇÃO QUE RETORNA A SOMA DOS PAGAMENTOS DE UM FUNCIONÁRIO -----------------------------------------
    getTotalPayments(employee?: PayrollEmployee): number{
        var total = 0;
        if(employee){
            this.formsName.forEach((data)=>{
                this.filteredFormsName.indexOf(data) > -1 ? total = total + employee[data] : total = total;    
            })
        } else{
            this.filteredEmployees.forEach((v) => {
                total = 0;
                this.formsName.forEach((data)=>{
                    this.filteredFormsName.indexOf(data) > -1 ? total = total + v[data] : total = total;    
                    v.total = total;
                })
            })
        }
        return total;
    }
    // ----------------------------------------------------------------------------------------------------
    
    //FUNÇÃO QUE ATUALIZA O VALOR TOTAL DA FOLHA DE PAGAMENTO ---------------------------------------------
    refreshTotalPayroll(){
        this.totalPayroll = 0;
        this.filteredEmployees.forEach((data)=>{
            this.totalPayroll = this.totalPayroll + data.total;
        })
    }
    // ----------------------------------------------------------------------------------------------------
    
    // FUNÇÃO QUE PROCESSA FOLHA DE PAGAMENTO E CRIA PAGAMENTOS NO BANCO ----------------------------------
    processPayroll(){
        this.filteredEmployees.forEach((employee)=>{
            this.formsName.forEach((v, index)=>{
                if(employee[v] != 0 && this.filteredFormsName.indexOf(v) > -1){
                    var payment = {} as PayrollPayment;
                    payment.bill = this.headers[index + 1] + " " + employee.employeeName;
                    payment.budgetId = 1;
                    payment.checkNumber = 0;
                    payment.date = this.payrollDate;
                    payment.employeeId = employee.employeeId;
                    payment.in = 0;
                    payment.note = "";
                    payment.paymentType = this.typePaymentDB[index];
                    payment.paymentWay = "deposito";
                    payment.status = "Pago";
                    payment.value = employee[v];
                    this.payments.push(payment);
                }
            })
            console.log(this.payments);
        })
    }
    // ----------------------------------------------------------------------------------------------------
    ngOnInit() {
        var self = this;
        this.main = this;
        
        // PREENCHE A VARIÁVEL 'EMPLOYEES' COM TODOS OS FUNCIONÁRIOS DO BANCO --------------------------
        this.appService.postSearchEmployees().subscribe((data)=>{
            this.filteredEmployees = [];
            this.employees = data;
            this.employees.filter((v)=>{ return v['dataDemissao'] == ''}).forEach((v)=>{
                var employee = {} as PayrollEmployee;
                employee.employeeId = v['id'];
                employee.employeeName = v['nome'];
                employee.employeeFunction = v['funcao_funcao'];
                employee.advance = 0;
                employee.salary = 0;
                employee.transport = 0;
                employee.empreita = 0;
                employee.basket = 0;
                employee.sharing = 0;
                employee.others = 0;
                employee.comission = 0;
                employee.total = 0;
                this.filteredEmployees.push(employee);
            })
            // CONSTRÓI FORM --------
            this.buildArrayForm().then((data)=>{
                this.payrollForm = this.formBuilder.group({
                    cbType: this.buildCbType(),
                    txtPayments: this.employeesForm,
                    txtDate: this.formBuilder.control('',[Validators.required])
                });
                this.payrollForm.get('txtPayments').valueChanges.subscribe((v)=>{
                    this.filteredEmployees.forEach((data, index)=>{
                        data.total = 0;
                        data.advance = v[index]['advance'] == null ?  0 : parseFloat(v[index]['advance']);
                        data.salary = v[index]['salary'] == null ? 0 : parseFloat(v[index]['salary']);
                        data.transport = v[index]['transport'] == null ? 0 : parseFloat(v[index]['transport']);
                        data.empreita = v[index]['empreita'] == null ? 0 : parseFloat(v[index]['empreita']);
                        data.basket = v[index]['basket'] == null ? 0 : parseFloat(v[index]['basket']);
                        data.sharing = v[index]['sharing'] == null ? 0 : parseFloat(v[index]['sharing']);
                        data.others = v[index]['others'] == null ? 0 : parseFloat(v[index]['others']);
                        data.comission = v[index]['comission'] == null ? 0 : parseFloat(v[index]['comission']);
                        data.total = this.getTotalPayments(data);
                    })
                    this.refreshTotalPayroll();
                })
                
                this.payrollForm.get('cbType').valueChanges.subscribe((v)=>{
                    this.filteredHeaders = ['Nome'];
                    this.filteredFormsName = [];
                    this.formsName.forEach((data, index) =>{
                        if(v[index]){
                            this.filteredFormsName.push(data);
                            this.filteredHeaders.push(this.headers[index + 1]);
                        }
                    })
                    this.filteredHeaders.push('Total');
                    this.getTotalPayments();
                    this.refreshTotalPayroll();
                })
                
                this.payrollForm.get('txtDate').valueChanges.subscribe((v)=>{
                    this.payrollDate = v;
                    console.log(this.payrollDate);
                })
                this.release = true;
            });
            // ----------------------
        })
        // ---------------------------------------------------------------------------------------------
    }
}