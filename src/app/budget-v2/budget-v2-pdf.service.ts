import { Component, OnInit, Injectable } from '@angular/core';
import {BudgetAmbient} from '../budget/budget-new/budget-ambient.model'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {BudgetPdf} from '../create-pdf/budget-pdf.model';
import {BudgetModel} from '../budget/budget.model';
import {AppService} from '../app.service';
import {IMAGE_LOGO} from '../app.logo';
import {ItemByAmbient} from './item-by-ambient.model';
import {BudgetV2}  from  './budget-v2.model';

@Injectable()
export class BudgetV2PdfService{
    constructor(private appService: AppService) { }
    defaultFontSize: number = 9;
    defaultMarginLeft: number = 20;
    defaultMarginRight: number = 21;
    item: BudgetPdf = { c1:"",
                        cod: "",
                        qtd: 0,
                        desc: "",
                        med: "",
                        det: "",
                        unit: "",
                        valor: "",
                        nec: "",
                        comodo: "",
                        valorTotalItem: 0,
                        c4: ""
    };

    imageLogo = IMAGE_LOGO;
    
    rows: BudgetPdf[] = [];
    
    //public gerarPDF(items: BudgetAmbient[], mainBudget: BudgetModel, cpf: string) {
    generatePDF(items: ItemByAmbient[], budget: BudgetV2, store: any, client: any, seller: any) {
        console.log(items);
        var self = this;
        var doc = new jsPDF('p', 'pt', 'a4');
        
        var item = this.item;
        var rows = this.rows;
        var count: number = 0;
        var totalBudget: number = 0;
        var columns = [
            {title: "Cód", key: "cod"}, 
            {title: "Qtd", key: "qtd"}, 
            {title: "Descrição", key: "desc"}, 
            {title: "Medida", key: "med"},
            {title: "Detalhe", key: "det"},
            {title: "Unitário", key: "unit"},
            {title: "Valor", key: "valor"},
            {title: "Necessário", key: "nec"}
        ];
        var columnsItems = [
            {title: "", key:"c1"},
            {title: "", key: "cod"}, 
            {title: "", key: "qtd"}, 
            {title: "", key: "desc"}, 
            {title: "", key: "med"},
            {title: "", key: "det"},
            {title: "", key: "unit"},
            {title: "", key: "valor"},
            {title: "", key: "nec"},
            {title: "", key:"c4"}
        ];
        var column=[{title:'', key:"c1"},{title:"", key:"cmd"},{title:'', key:"value"},{title:'', key:"c4"}];
        var row = [{cmd:"",value:""}];
        
        var columnTotal = [{title:"", key:"c1"}, {title:"", key:"valor"}, {title:"", key:"c4"}];
        var columnLine = [{title:"", key:"valor"}];
        
        
        var styleColumnAmbient = {
            cmd:{cellWidth: 300, halign: 'left'}, 
            value: {cellWidth: 240, fontStyle: 'bold', halign: 'right'},
            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
        };
        
        var columnsHeader=[
            {title: "", key:"c1"},
            {title: "", key:"image"},
            {title: "", key:"data"},
            {title: "", key:"c4"}
        ];
            
        var cabecalho = "\n Belartte Design em Acabamentos \n Rua Itanhaem, 2457 \n Ribeirão Preto/SP \n Fone: 16| 3628-5268 / 3628-5162 \n www.belartte.com\n"
        var rowHeader=[{image:"", data: cabecalho, c1:"", c4:""}];
        
        var columnsInfo1 = [{title: "", key:"c1"},
                            {title: "", key:"budgetNumber"},
                            {title:"", key:"date"},
                            {title:"", key:"c4"}];
        
        var columnsInfo2 = [{title: "", key:"c1"},
                            {title: "", key:"column1"},
                            {title: "", key:"column2"},
                            {title: "", key:"c4"}];
        
        var columnsInfo3 = [{title: "", key:"c1"},
                            {title: "", key:"column3"},
                            {title: "", key:"column4"},
                            {title: "", key:"c4"}];
        
        function lineBottom():any{
            return doc.autoTable(columnLine, [{valor: ""}],
                          {theme: 'plain', 
                           columnStyles: {
                                        valor: {cellWidth:545, fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 0, fontSize: 1},
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                           showHead: "false",
                           startY: doc.previousAutoTable.finalY 
            });
        }
        
        function numberToReal(numero: number):string{
            var formatado = "R$ " + numero.toFixed(2).replace(".",",");
            return formatado;
        }
        
        function lineTop():any{
            
            return doc.autoTable(columnLine, [{valor: ""}],
                          {theme: 'plain', 
                           columnStyles: {
                                        valor: {cellWidth:545, fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 0, fontSize: 1},
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                           showHead: "false"
            });
        }
        function lineBottomAmmount():any{
            return doc.autoTable(columnLine, [{valor: ""}],
                          {theme: 'plain', 
                           columnStyles: {
                                        valor: {fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 0, fontSize: 1},
                          margin:{top:0, left: 450, right: self.defaultMarginRight},
                           showHead: "false",
                           startY: doc.previousAutoTable.finalY 
            });
        }
        //********************************************* LOGO + COMPANY DATA *****************************************************************
        lineTop();
        doc.autoTable(columnsHeader, rowHeader,{showHead: 'false', theme:'plain',
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
                                            
            margin:{left: self.defaultMarginLeft, right: self.defaultMarginRight},
            startY: doc.previousAutoTable.finalY  
        });
        
        lineBottom();
        //********************************************* LOGO + COMPANY DATA *****************************************************************
        
        
        //********************************************************** BUDGET NUMBER AND DATE *******************************************************
        lineTop();
        doc.autoTable(columnsInfo1, [{budgetNumber: "Orçamento No.: " + budget.id + "   Ed.: " + budget.retificated, date: "Data: " + budget.date, c1:"", c4:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            budgetNumber: {cellWidth: 400, fontStyle: 'bold', halign: "left"},
                            date: {cellWidth: 140, fontStyle: 'bold', halign: "left"},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", cellPadding: 1},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** BUDGET NUMBER AND DATE *******************************************************
        
        //**********************************************************CLIENT DATA*******************************************************
        if(store['name'] != "Belartte"){
            //**********************************************************STORE DATA*******************************************************
            console.log("É LOJA!!");
            doc.autoTable(columnsInfo2, [{column1: "Loja: " + store['nome'], column2: ""},
                                         {column1: "Vendedor: " + seller['nome'], column2: "Telefone: " + store['telefone']},
                                         {column1: "E-mail: " + store['email'], column2: "Celular: " + store['celular']}],
                          {theme: 'plain', 
                          columnStyles: {
                                        c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                                        column1: {cellWidth: 380, fontStyle: 'bold', halign: "left"},
                                        column2: {cellWidth: 160, fontStyle: 'bold', halign: "left"},
                                        c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 1, fontSize: self.defaultFontSize},                       
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                          startY: doc.previousAutoTable.finalY                    
            });
            lineBottom();
            //**********************************************************STORE DATA*******************************************************
            
            //**********************************************************THIRD DATA*******************************************************
            
            doc.autoTable(columnsInfo3, [{column3: "Cliente: " + client['nome'], column4: ""},
                                         {column3: "Telefone: " + client['telefone'], column4: "Celular: " + client['celular']},
                                         {column3: "E-mail: " + client['email'], column4: ""},
                                         {column3: "Endereço Obra: " + client['endereco'], column4: ""}],
                          {theme: 'plain', 
                          columnStyles: {
                                        c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                                        column3: {cellWidth: 380, fontStyle: 'bold', halign: "left"},
                                        column4: {cellWidth: 160, fontStyle: 'bold', halign: "left"},
                                        c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 1, fontSize: self.defaultFontSize},                       
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                          startY: doc.previousAutoTable.finalY                
            });
            lineBottom();
            //**********************************************************THIRD DATA*******************************************************
        } else{
            //**********************************************************PHISIC CLIENT DATA*******************************************************
            console.log("NÃO É LOJA!");
            lineTop()
            doc.autoTable(columnsInfo2, [{column1: "Nome: " + client['nome'], column2: ""},
                                         {column1: "Vendedor: " + seller['nome'], column2: "Telefone: " + client['telefone']},
                                         {column1: "E-mail: " + client['email'], column2: "Celular: " + client['celular']},
                                         {column1: "Endereço: " + client['endereco'], column2: "CPF: " + client['cpf']}],
                          {theme: 'plain', 
                          columnStyles: {
                                        c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                                        column1: {cellWidth: 380, fontStyle: 'bold', halign: "left"},
                                        column2: {cellWidth: 160, fontStyle: 'bold', halign: "left"},
                                        c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 1, fontSize: self.defaultFontSize},                       
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                          startY: doc.previousAutoTable.finalY                   
            });
            lineBottom();
            //**********************************************************PHISIC CLIENT DATA*******************************************************
        }
        
        //**********************************************************CLIENT DATA*******************************************************
        
        //**********************************************************BUDGET TITLE*******************************************************
        console.log("TITLE");
        doc.autoTable(columnTotal, [{valor: "ORÇAMENTO"}],
                          {theme: 'plain', 
                          columnStyles: {
                                        valor: {cellWidth: 540, fontStyle: 'bold', halign: "center", fontSize: 16},
                                      },
                          styles: {halign: "center"},                       
                          margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
                          startY: doc.previousAutoTable.finalY + 20                      
            });
        //**********************************************************BUDGET TITLE*******************************************************
        
        //**********************************************************HEADER*******************************************************
        lineTop();
        console.log("HEADER");
        doc.autoTable(columns, [{c1:"",cod:"",qtd:"",desc:"",med:"",det:"",unit:"",valor:"",nec:"",c4:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            cod: {cellWidth: 30, fontStyle: 'bold'},
                            qtd: {cellWidth: 27, fontStyle: 'bold'},
                            desc: {cellWidth: 103, fontStyle: 'bold'},
                            med: {cellWidth: 65, fontStyle: 'bold'},
                            det: {cellWidth: 115, fontStyle: 'bold'},
                            unit: {cellWidth: 60, fontStyle: 'bold'},
                            valor: {cellWidth: 60, fontStyle: 'bold'},
                            nec: {cellWidth: 78, fontStyle: 'bold'},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", fontSize: self.defaultFontSize},   
            bodyStyles:{cellPadding: 0, fontSize: 1.5, fillColor: [0,0,0]},                                                                                                 
            margin:{left: self.defaultMarginLeft, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                      
        });
        
        //********************************************************** HEADER *******************************************************
        
        
        //******************************************************* BUDGET ITEMS + AMBIENT CELLS **************************************************
        items.forEach(function(data){
            row[0].cmd  = data.ambient;
            console.log(data.ambientValue);
            
            row[0].value = "Total " + data.ambient + " : " + self.appService.converteFloatMoeda(data.ambientValue) + "  ";
            //********************************************************** AMBIENT CELL **********************************************************
            console.log("AMBIENT CELL");
            doc.autoTable(column, row, {margin: {left: self.defaultMarginLeft, right: self.defaultMarginRight}, styles: {halign: "center", fillColor: [211,211,211], cellPadding: 1, fontSize: self.defaultFontSize}, columnStyles: styleColumnAmbient, startY: doc.previousAutoTable.finalY, theme: 'plain'});
            lineBottom();
            //********************************************************** AMBIENT CELL **********************************************************
            
            data.items.forEach(function(value){
                item.cod = value.cod.toString();
                item.qtd = value.qtd;
                item.desc = value.item;
                item.med = value.measure;
                item.det = value.detail;
                item.unit = self.appService.converteFloatMoeda(value.unitValue);
                item.valor = self.appService.converteFloatMoeda(value.totalValue);
                item.nec = value.necessary;
                item.comodo = value.ambient;
                item.valorTotalItem = self.appService.converteFloatMoeda(value.totalValue);
                rows.push(item);
                item = {
                        c1:"",
                        cod: "",
                        qtd: 0,
                        desc: "",
                        med: "",
                        det: "",
                        unit: "",
                        valor: "",
                        nec: "",
                        comodo: "",
                        valorTotalItem: 0,
                        c4:""
                       };
                count++;
            });
            count = 0;
            
            //********************************************* BUDGET ITEM *******************************************************
            console.log("BUDGET ITEM");
            doc.autoTable(columnsItems, rows, {margin: {left: self.defaultMarginLeft, right: self.defaultMarginRight}, startY: doc.previousAutoTable.finalY,theme: 'plain', styles: {fontSize: self.defaultFontSize}, columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            cod: {cellWidth: 30, fontStyle: 'bold'},
                            qtd: {cellWidth: 32, fontStyle: 'bold'},
                            desc: {cellWidth: 95, fontStyle: 'bold'},
                            med: {cellWidth: 65, fontStyle: 'bold'},
                            det: {cellWidth: 110, fontStyle: 'bold'},
                            unit: {cellWidth: 75, fontStyle: 'bold'},
                            valor: {cellWidth: 75, fontStyle: 'bold'},
                            nec: {cellWidth: 65, fontStyle: 'bold'},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottom();
            //********************************************* BUDGET ITEM *******************************************************
            
            rows = [];
            totalBudget = budget.totalValue;
            //totalBudget = totalBudget + self.appService.converteMoedaFloat(data.valorTotalAmbiente);
        });
        //******************************************************* BUDGET ITEMS + AMBIENT CELLS **************************************************
        
        //*********************************************************** FREIGHT (IF APPLICABLE) ***********************************************************
        if(budget.freightValue > 0){
            console.log("FREIGHT");
            //****************************************************** DISCOUNT ***************************************************************
            doc.autoTable(columnTotal, [{valor: "Frete: " + self.appService.converteFloatMoeda(budget.freightValue)}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 0.75, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottomAmmount();
            //****************************************************** DISCOUNT ***************************************************************
        }
        //*********************************************************** FREIGHT (IF APPLICABLE) ***********************************************************
        
        //********************************************************* AMOUNT **********************************************************************
        console.log("AMOUNT");
        doc.autoTable(columnTotal, [{valor: "Total: " + self.appService.converteFloatMoeda(budget.totalValue) + "  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
        lineBottomAmmount();
        //********************************************************* AMOUNT **********************************************************************
        
        //*********************************************************** DISCOUNT (IF APPLICABLE) ***********************************************************
        if(budget.discount > 0){
            console.log("DISCOUNT");
            //****************************************************** DISCOUNT ***************************************************************
            doc.autoTable(columnTotal, [{valor: "Desconto: " + budget.discount + "%  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 0.75, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottomAmmount();
            //****************************************************** DISCOUNT ***************************************************************
        }
        //*********************************************************** DISCOUNT (IF APPLICABLE) ***********************************************************
        
        //****************************************************** VALUE WITH DISCOUNT ***************************************************************
            console.log("VALUE WITH DISCOUNT");
            doc.autoTable(columnTotal, [{valor: "Valor Final: " + self.appService.converteFloatMoeda(budget.discountValue + budget.freightValue) + "  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottomAmmount();
        //****************************************************** VALUE WITH DISCOUNT ***************************************************************
        
        //**********************************************************BUDGET NOTE*******************************************************
        console.log("NOTE");
        
        if(budget.note != ""){
            lineTop();
            doc.autoTable(columnTotal, [{valor: budget.note}],
                              {theme: 'plain', 
                              columnStyles: {
                                            c1: {cellWidth: 0.03, fontStyle: 'bold', fillColor: [0,0,0]},
                                            c4: {cellWidth: 0.03, fontStyle: 'bold', fillColor: [0,0,0]}
                                          },
                              styles: {halign: "left"},                       
                              margin:{left: self.defaultMarginLeft, right: self.defaultMarginRight},
                              startY: doc.previousAutoTable.finalY                   
                });
            lineBottom();
        }
        //**********************************************************BUDGET NOTE*******************************************************
        
        doc.save('Orçamento '+ budget.id + ' Ed '+ budget.retificated + ' ' + store['nome'] + ' ('+  client['nome'] +').pdf'.replace(/[\/]/g,'%2F'));
        
    }
}