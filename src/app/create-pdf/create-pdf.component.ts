import { Component, OnInit, Injectable } from '@angular/core';
import {BudgetAmbient} from '../budget/budget-new/budget-ambient.model'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {BudgetPdf} from './budget-pdf.model';
import {BudgetModel} from '../budget/budget.model';
import {AppService} from '../app.service';

@Component({
  selector: 'sivp-create-pdf',
  templateUrl: './create-pdf.component.html',
  styleUrls: ['./create-pdf.component.css']
})
@Injectable()
export class CreatePdfComponent implements OnInit {

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
    imageLogo = 'data:image/png;base64,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';
    
    rows: BudgetPdf[] = [];
    
    public gerarPDF(items: BudgetAmbient[], mainBudget: BudgetModel) {
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
            
        var cabecalho = "\n Belartte Design em Porcelanatos \n Rua Itanhaem, 2457 - Vila Elisa \n Ribeirão Preto/SP \n Fone: 16| 3628-5268 / 3628-5162 \n Visite: www.belartte.com.br\n"
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
        
                    doc.addImage(base64Img, 'PNG', data.cell.x + 10, data.cell.y + 2);
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
        doc.autoTable(columnsInfo1, [{budgetNumber: "Orçamento No.: " + mainBudget.number + "   Ed.: " + mainBudget.rectified, date: "Data: " + mainBudget.date, c1:"", c4:""}], {theme: 'plain', 
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
        //if(mainBudget.client.type == "LOJ"){
        if(mainBudget.client.name != "Belartte"){
            //**********************************************************STORE DATA*******************************************************
            console.log("É LOJA!!");
            doc.autoTable(columnsInfo2, [{column1: "Loja: " + mainBudget.client.name, column2: ""},
                                         {column1: "Vendedor: " + mainBudget.vendor, column2: "Telefone: " + mainBudget.client.tel},
                                         {column1: "E-mail: " + mainBudget.client.email, column2: "Celular: " + mainBudget.client.cel}],
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
            
            doc.autoTable(columnsInfo3, [{column3: "Cliente: " + mainBudget.terceiro.name, column4: ""},
                                         {column3: "Telefone: " + mainBudget.terceiro.tel, column4: "Celular: " + mainBudget.terceiro.cel},
                                         {column3: "E-mail: " + mainBudget.terceiro.email, column4: ""},
                                         {column3: "Endereço Obra: " + mainBudget.terceiro.address, column4: ""}],
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
            doc.autoTable(columnsInfo2, [{column1: "Nome: " + mainBudget.terceiro.name, column2: ""},
                                         {column1: "Vendedor: " + mainBudget.vendor, column2: "Telefone: " + mainBudget.terceiro.tel},
                                         {column1: "E-mail: " + mainBudget.terceiro.email, column2: "Celular: " + mainBudget.terceiro.cel}],
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
            row[0].cmd  = data.comodo;
            console.log(data.valorTotalAmbiente);
            
            row[0].value = "Total " + data.comodo + " : " + self.appService.converteFloatMoeda(data.valorTotalAmbiente) + "  ";
            //********************************************************** AMBIENT CELL **********************************************************
            console.log("AMBIENT CELL");
            doc.autoTable(column, row, {margin: {left: self.defaultMarginLeft, right: self.defaultMarginRight}, styles: {halign: "center", fillColor: [211,211,211], cellPadding: 1, fontSize: self.defaultFontSize}, columnStyles: styleColumnAmbient, startY: doc.previousAutoTable.finalY, theme: 'plain'});
            lineBottom();
            //********************************************************** AMBIENT CELL **********************************************************
            
            data.qtd.forEach(function(value){
                item.cod = data.cod[count];
                item.qtd = data.qtd[count];
                item.desc = data.item[count];
                item.med = data.medida[count];
                item.det = data.detalhe[count];
                //item.unit = numberToReal(data.valor[count]);;
                item.unit = data.valor[count].toString();
                //item.valor = numberToReal(data.valorTotal[count]);
                item.valor = data.valorTotal[count].toString();
                item.nec = data.necessario[count];
                item.comodo = data.comodo;
                item.valorTotalItem = data.valorTotal[count];
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
            totalBudget = totalBudget + self.appService.converteMoedaFloat(data.valorTotalAmbiente);
        });
        //******************************************************* BUDGET ITEMS + AMBIENT CELLS **************************************************

        //********************************************************* AMOUNT **********************************************************************
        console.log("AMOUNT");
        //doc.autoTable(columnTotal, [{valor: "Total: " + numberToReal(totalBudget) + "   "}],{margin: {top:0, left: 450, right: 24}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
        doc.autoTable(columnTotal, [{valor: "Total: " + self.appService.converteFloatMoeda(mainBudget.valorTotal) + "  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
        lineBottomAmmount();
        //********************************************************* AMOUNT **********************************************************************
        
        //*********************************************************** DISCOUNT (IF APPLICABLE) ***********************************************************
        if(mainBudget.discount > 0){
            console.log("DISCOUNT");
            //****************************************************** DISCOUNT ***************************************************************
            doc.autoTable(columnTotal, [{valor: "Desconto: " + mainBudget.discount + "%  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 0.75, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottomAmmount();
            //****************************************************** DISCOUNT ***************************************************************
            
            //****************************************************** VALUE WITH DISCOUNT ***************************************************************
            console.log("VALUE WITH DISCOUNT");
            //doc.autoTable(columnTotal, [{valor: "Valor Final: " + numberToReal(mainBudget.valorComDesconto) + "   "}],{margin: {top:0, left: 450, right: 24}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
            doc.autoTable(columnTotal, [{valor: "Valor Final: " + self.appService.converteFloatMoeda(mainBudget.valorComDesconto) + "  "}],{margin: {top:0, left: 450, right: self.defaultMarginRight}, showHead: 'false', startY: doc.previousAutoTable.finalY, theme: 'plain', styles: {halign: "right", fillColor: [211,211,211], cellPadding: 0}, columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 0.5, fontStyle: 'bold', fillColor: [0,0,0]}
                          }});
            lineBottomAmmount();
            //****************************************************** VALUE WITH DISCOUNT ***************************************************************
        }
        //*********************************************************** DISCOUNT (IF APPLICABLE) ***********************************************************
        
        //**********************************************************BUDGET NOTE*******************************************************
        console.log("NOTE");
        
        if(mainBudget.note != ""){
            lineTop();
            doc.autoTable(columnTotal, [{valor: mainBudget.note}],
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
        
        doc.save('Orçamento '+ mainBudget.number + ' Ed '+ mainBudget.rectified + ' ' + mainBudget.client.name + ' ('+  mainBudget.terceiro.name +').pdf'.replace(/[\/]/g,'%2F'));
        
    }
    
  ngOnInit() {
  }

}
