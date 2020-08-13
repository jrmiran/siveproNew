import {Injectable} from "@angular/core";
import {AppService} from "../app.service";
import {Payment} from './payment.model';
import {PaymentByType} from './payment-by-type.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {IMAGE_LOGO} from '../app.logo';

@Injectable()
export class PaymentReportService{
    constructor(private appService: AppService){}
    
    //PARAMETERS ----------------------------------
    defaultFontSize: number = 9;
    defaultMarginLeft: number = 20;
    defaultMarginRight: number = 21;
    imageLogo = IMAGE_LOGO;
    columnsHeader=[
            {title: "", key:"c1"},
            {title: "", key:"image"},
            {title: "", key:"data"},
            {title: "", key:"c4"}
    ];
    cabecalho = "\n Belartte Design em Acabamentos \n Rua Itanhaem, 2457 \n Ribeirão Preto/SP \n Fone: 16| 3628-5268 / 3628-5162 \n www.belartte.com\n";
    rowHeader=[{image:"", data: this.cabecalho, c1:"", c4:""}];
    columnLine = [{title:"", key:"valor"}];
    columnTotal = [{title:"", key:"c1"}, {title:"", key:"valor"}, {title:"", key:"c4"}];
    row = [{cmd:"",value:""}];
    // --------------------------------------------
    
    processPaymentReport(payments: Payment[], startDate: any, endDate: any){
        // Payments separated by IN and OUT --------------------------------------------------------------
        var inPayments: Payment[] = payments.filter((v)=>{ return v.status == 'Entrada'; });
        var outPayments: Payment[] = outPayments = payments.filter((v)=>{ return v.status == 'Saída'; });
        // -----------------------------------------------------------------------------------------------
        // Total value of IN and OUT Payments ------------------------------------------------------------
        var totalValueIn: number = this.getTotalValue(inPayments);
        var totalValueOut: number = this.getTotalValue(outPayments);
        // -----------------------------------------------------------------------------------------------
        // Types of IN and OUT Payments ------------------------------------------------------------------
        var inTypes: string[] = this.getPaymentTypes(inPayments);
        var outTypes: string[] = this.getPaymentTypes(outPayments);
        // -----------------------------------------------------------------------------------------------
        // Payments Separated by IN and OUT with total value ---------------------------------------------
        var inPaymentsByType: PaymentByType[] = this.joinPaymentsByType(inPayments, inTypes);
        var outPaymentsByType: PaymentByType[] = this.joinPaymentsByType(outPayments, outTypes);
        // -----------------------------------------------------------------------------------------------
        var doc = new jsPDF('p', 'pt', 'a4');
        // FUNÇÃO QUE ACRESCENTA UMA LINHA 'BOTTOM' NA TABELA ------------------------------------------------
        var lineBottom = ()=>{
            return doc.autoTable(this.columnLine, [{valor: ""}],
                {theme: 'plain', 
                columnStyles: {
                    valor: {cellWidth:545, fillColor: [0,0,0]}
                },
                styles: {halign: "center", cellPadding: 0, fontSize: 1},
                margin:{left: this.defaultMarginLeft, top: 50, right: this.defaultMarginRight},
                showHead: "false",
                startY: doc.previousAutoTable.finalY 
                });
        }
        // ---------------------------------------------------------------------------------------------------
        // FUNÇÃO QUE ACRESCENTA UMA LINHA 'TOP' NA TABELA ---------------------------------------------------
        var lineTop = ()=>{
            return doc.autoTable(this.columnLine, [{valor: ""}],
                {theme: 'plain', 
                columnStyles: {
                    valor: {cellWidth:545, fillColor: [0,0,0]}
                },
                styles: {halign: "center", cellPadding: 0, fontSize: 1},
                margin:{left: this.defaultMarginLeft, top: 50, right: this.defaultMarginRight},
                showHead: "false"
                });
        }
        // ---------------------------------------------------------------------------------------------------
        // FUNÇÃO QUE ACRESCENTA LINHA DE SEPARAÇÃO ----------------------------------------------------------
        var separationRow = (title: string, totalValue: string)=>{
            
            var textColor = title == "Entrada" || title == "Saída" ? [255,255,255] : [0,0,0];
            var fillColor = title == "Entrada" || title == "Saída" ? [49,51,53] : [211,211,211];
            var align = title == "Entrada" || title == "Saída" ? 'left' : 'left';
            var value = totalValue == "" ? "" : "Valor: " + totalValue;
            
            return doc.autoTable([{title: "", key: "c1"},
                           {title: "", key: "title"},
                           {title: "", key: "totalValue"},
                           {title: "", key: "c2"}
                          ],
                          [{c1: "",
                            c2: "",
                            totalValue: value,
                            title: title}
                          ], 
                          {margin: {left: this.defaultMarginLeft, right: this.defaultMarginRight}, 
                           styles: {halign: "center", fillColor: fillColor,
                           cellPadding: 1, 
                           fontSize: this.defaultFontSize},
                           columnStyles: {
                                            title:{cellWidth: 340, halign: align, fillColor: fillColor, textColor: textColor, fontStyle: 'bold'}, 
                                            totalValue:{cellWidth: 200, halign: "right", fillColor: fillColor, textColor: textColor, fontStyle: 'bold'}, 
                                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                                            c2: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                            },
                           startY: doc.previousAutoTable.finalY,
                           theme: 'plain'});
        }
        // ---------------------------------------------------------------------------------------------------
        // FUNÇÃO QUE ACRESCENTA LINHAS DE DADOS DE PAGAMENTOS -----------------------------------------------
        var paymentsData = (rows)=>{
            return doc.autoTable(
                [{title: "", key: "c1"},
                 {title: "", key: "id"},
                 {title: "", key: "bill"},
                 {title: "", key: "date"},
                 {title: "", key: "paymentWay"},
                 {title: "", key: "value"},
                 {title: "", key: "c2"},
                ],
                rows,
                {columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            id: {cellWidth: 20},
                            bill: {cellWidth: 180},
                            date: {cellWidth: 100},
                            paymentWay: {cellWidth: 150},
                            value: {cellWidth: 88},
                            c2: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
                styles: {halign: "left", fontSize: this.defaultFontSize},   
                bodyStyles:{cellPadding: 0, fontSize: this.defaultFontSize},
                margin:{left: this.defaultMarginLeft, right: this.defaultMarginRight},
                startY: doc.previousAutoTable.finalY ,
                theme: 'plain'}
            );
        }
        // ---------------------------------------------------------------------------------------------------
        
        
        //LOGO + COMPANY DATA ***************************************************************************
        lineTop();
        doc.autoTable(this.columnsHeader, this.rowHeader,{showHead: 'false', theme:'plain',
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 0) {
                    var base64Img = this.imageLogo;
                    doc.addImage(base64Img, 'PNG', data.cell.x + 1, data.cell.y + 10, 278, 70);
                }
            },
            rowStyles: {
                            0: {cellHeigth: 50, fillColor: [0,0,0]}
                          }, 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            image: {cellWidth: 350, fontStyle: 'bold'},
                            data: {cellWidth: 190, fontStyle: 'bold'},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                          },    
                                            
            margin:{left: this.defaultMarginLeft, right: this.defaultMarginRight},
            startY: doc.previousAutoTable.finalY  
        });
        
        lineBottom();
        // *********************************************************************************************
        // TITLE ***************************************************************************************
        doc.autoTable(this.columnTotal, [{valor: "RELATÓRIO FINANCEIRO"}],
            {theme: 'plain', 
            columnStyles: {
            valor: {cellWidth: 540, fontStyle: 'bold', halign: "center", fontSize: 16},
            },
            styles: {halign: "center"},                       
            margin:{left: this.defaultMarginLeft, top: 50, right: this.defaultMarginRight},
            startY: doc.previousAutoTable.finalY + 20                      
        });
        // *********************************************************************************************
        // DATE INTERVAL *******************************************************************************
        doc.autoTable([{title: "", key: "valor"}], [{valor: `De ${startDate} Até ${endDate}`}],
            {theme: 'plain', 
            columnStyles: {
            valor: {cellWidth: 540, fontStyle: 'bold', halign: "left", fontSize: 8},
            },
            styles: {halign: "center"},                       
            margin:{left: this.defaultMarginLeft, top: 50, right: this.defaultMarginRight},
            startY: doc.previousAutoTable.finalY + 20                      
        });
        // *********************************************************************************************
        // HEADER **************************************************************************************
         lineTop();
        doc.autoTable([ {title: "ID", key: "id"},
                        {title: "Pagamento", key: "bill"},
                        {title: "Data", key: "date"},
                        {title: "Forma Pagamento", key: "paymentWay"},
                        {title: "Valor", key: "value"},
                      ], 
            [{c1:"",bill:"",date:"",paymentWay:"",value:"",c4:""}],
            {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            bill: {cellWidth: 180, fontStyle: 'bold'},
                            date: {cellWidth: 100, fontStyle: 'bold'},
                            paymentWay: {cellWidth: 150, fontStyle: 'bold'},
                            value: {cellWidth: 88, fontStyle: 'bold'},
                            id: {cellWidth: 20, fontStyle: 'bold'},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", fontSize: this.defaultFontSize},   
            bodyStyles:{cellPadding: 0, fontSize: 1.5, fillColor: [0,0,0]},
            margin:{left: this.defaultMarginLeft, right: this.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                      
        });
        // *********************************************************************************************
        
        // IN PAYMENTS DATA ****************************************************************************
        separationRow("Entrada", this.appService.converteFloatMoeda(this.getTypeTotalValue(inPaymentsByType)));
        lineBottom();
        inPaymentsByType.forEach((payment)=>{
            var rows = [];
            separationRow(payment.type, this.appService.converteFloatMoeda(this.appService.toFixed2(payment.totalValue)));
            lineBottom();
            payment.payments.forEach((p)=>{
                rows.push({c1: "",id: p.id ,bill: p.bill, date: p.date, paymentWay: p.paymentForm, value: this.appService.converteFloatMoeda(p.value), c2: ""})
            })
            paymentsData(rows);
            
        })
        // *********************************************************************************************
        // OUT PAYMENTS DATA ****************************************************************************
        separationRow("Saída", this.appService.converteFloatMoeda(this.getTypeTotalValue(outPaymentsByType)));
        lineBottom();
        outPaymentsByType.forEach((payment)=>{
            var rows = [];
            separationRow(payment.type, this.appService.converteFloatMoeda(this.appService.toFixed2(payment.totalValue)));
            lineBottom();
            payment.payments.forEach((p)=>{
                rows.push({c1: "", id: p.id ,bill: p.bill, date: p.date, paymentWay: p.paymentForm, value: this.appService.converteFloatMoeda(p.value), c2: ""})
            })
            paymentsData(rows);
            
        })
        lineBottom();
        // *********************************************************************************************
        
        // RESUMO **************************************************************************************
        doc.autoTable(
                [{title: "", key: "c1"},
                 {title: "", key: "resumo"},
                 {title: "", key: "c2"},
                ],
                [
                 {c1: "", c2: "", resumo: "Valor Total Entradas: " + this.appService.converteFloatMoeda(this.appService.toFixed2(this.getTypeTotalValue(inPaymentsByType)))},
                {c1: "", c2: "", resumo: "Valor Total Saídas: " + this.appService.converteFloatMoeda(this.appService.toFixed2(this.getTypeTotalValue(outPaymentsByType)))},
                {c1: "", c2: "", resumo: "Saldo: " + this.appService.converteFloatMoeda(this.appService.toFixed2(this.getTypeTotalValue(inPaymentsByType)) - this.appService.toFixed2(this.getTypeTotalValue(outPaymentsByType)))},  
                ],
                {columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            resumo: {cellWidth: 540, halign: 'left', fillColor: [211,211,211], fontStyle: 'bold'}
                          },
                styles: {halign: "left", fontSize: this.defaultFontSize},   
                bodyStyles:{cellPadding: 0, fontSize: this.defaultFontSize},
                margin:{left: this.defaultMarginLeft, right: this.defaultMarginRight},
                startY: doc.previousAutoTable.finalY ,
                theme: 'plain'}
            );
        lineBottom();
        // *********************************************************************************************
        
        var fileName = this.appService.replaceAll(`Relatório Financeiro_${startDate}_${endDate}.pdf`, '/', '-');
        doc.save(fileName);
        
        
    }
    // FUNÇÃO QUE RETORNA O VALOR TOTAL DE PAGAMENTOS PASSADOS POR PARÂMETRO -----------------------------
    getTotalValue(payments: Payment[]): number{
        var total = 0;
        payments.forEach((data)=>{
            total = total + data.value;
        })
        return total;
    }
    // ---------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE RETORNA VETOR COM TODOS OS TIPOS DE PAGAMENTOS PRESENTES NOS PAGAMENTOS PASSADOS POR PARAMETRO ------
    getPaymentTypes(payments: Payment[]): string[]{
        var types: string[] = [];
        payments.forEach((data)=>{
            if(types.indexOf(data.paymentType) < 0){
                types.push(data.paymentType);
            }    
        })
        return types;
    }
    // -----------------------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE AGRUPA OS PAGAMENTOS DO PARÂMETRO EM TIPOS DE PAGAMENTO ----------------------------------------------
    joinPaymentsByType(payments: Payment[], types: string[]): PaymentByType[]{
        var paymentsByType: PaymentByType[] = [];
        types.forEach((data)=>{
            var pbt = {} as PaymentByType;
            var p = payments.filter((v)=>{return v.paymentType == data});
            var totalValue = this.getTotalValue(p);
            
            pbt.type = data;
            pbt.payments = p;
            pbt.totalValue = totalValue;  
            paymentsByType.push(pbt);
        })
        return paymentsByType;
    }
    // -----------------------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE RETORNA O VALOR TOTAL DE ENTRADA OU SAÍDA ------------------------------------------------------------
    getTypeTotalValue(paymentsByType: PaymentByType[]){
        var total = 0;
        paymentsByType.forEach((data)=>{
            total = total + data.totalValue;
        })
        return total;
    }
    // ----------------------------------------------------------------------------------------------------------------
    // FUNÇÃO QUE RETORNA CHAVE COM TIPOS E VALORES DOS PAGAMENTOS ----------------------------------------------------
    getValuesPaymentByType(payments: PaymentByType[]){
        var response: any[] = [];
        payments.forEach((p)=>{
            response.push({type: p.type, value: p.totalValue});
        })
        return response;
    }
    // ----------------------------------------------------------------------------------------------------------------
    
}