import { Component, OnInit, Injectable } from '@angular/core';
import {BudgetAmbient} from '../budget/budget-new/budget-ambient.model'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {BudgetPdf} from '../create-pdf/budget-pdf.model';
import {BudgetModel} from '../budget/budget.model';
import {AppService} from '../app.service';
import {SoPdfModel} from  './so-pdf.model'

@Component({
  selector: 'sivp-create-pdf-so',
  templateUrl: './create-pdf-so.component.html',
  styleUrls: ['./create-pdf-so.component.css']
})

@Injectable()
export class CreatePdfSOComponent implements OnInit {

  constructor(private appService: AppService) { }
    defaultFontSize: number = 10;
    defaultMarginLeft: number = 20;
    defaultMarginRight: number = 21;
    projectDraw = 'data:image/png;base64,MTE3LDExMCwxMDAsMTAxLDEwMiwxMDUsMTEwLDEwMSwxMDA=';
    
    rows: BudgetPdf[] = [];
    
    public gerarPDF(so: SoPdfModel) {
        var self = this;
        var doc = new jsPDF('l', 'pt', 'a4');
        
        var columnLine = [{title:"", key:"valor"}];
        var columnsInfo1 = [{title: "", key:"c1"},
                            {title: "", key:"c2"},
                            {title: "", key:"c3"},
                            {title: "", key:"c4"},
                            {title:"", key:"c5"},
                            {title:"", key:"c6"}];
        var columnsNote = [{title: "", key:"c1"},
                            {title: "", key:"c2"},
                            {title: "", key:"c3"},
                            {title: "", key:"c4"},
                            {title:"", key:"c5"},
                            {title:"", key:"c6"},
                            {title:"", key:"c7"}];
        
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
                          margin:{left: self.defaultMarginLeft, top: 20, right: self.defaultMarginRight},
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
        
        //********************************************************** SO DATA *******************************************************
        lineTop();
        doc.autoTable(columnsInfo1, [{c2: "Loja: " + so.store, c3: "Cliente: " + so.client, c1:"", c4:"", c5:"Entrega: ____/____", c6:""}, {c2: "Material: " + so.material, c3: "Corredor: " + so.location, c1:"", c4:"", c5:"OS: " + so.id, c6:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 200, fontStyle: 'bold', halign: "left"},
                            c3: {cellWidth: 200, fontStyle: 'bold', halign: "left"},
                            //limitDate: {cellWidth: 140, fontStyle: 'bold', halign: "left"},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c5: {cellWidth: 80, fontStyle: 'bold', halign: "left"},
                            c6: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", cellPadding: 1, fontSize: this.defaultFontSize},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** SO DATA *******************************************************
        
        //********************************************************** FINISHING *******************************************************
        doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c2: so.item + " - " + so.ambient, c1:"", c3:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 483, halign: "center"},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                          },
            styles: {halign: "center", cellPadding: 1, fontSize: 12},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** FINISHING *******************************************************
        
        
        //********************************************* PROJECT DRAW *****************************************************************
        doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c1:"",c2:"",c3:""}],{showHead: 'false', theme:'plain',
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 1) {
                    var base64Img = this.projectDraw;
        
                    doc.addImage(so.image, 'PNG', data.cell.x + 20, data.cell.y + 10);
                }
            },
            rowStyles: {
                            0: {cellHeigth: 50, fillColor: [0,0,0]}
                          }, 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 483, fontStyle: 'bold'},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                          },    
            styles: {halign: "center", cellPadding: 200, fontSize: this.defaultFontSize},                                   
            margin:{left: self.defaultMarginLeft, right: self.defaultMarginRight},
            startY: doc.previousAutoTable.finalY  
        });
        
        lineBottom();
        //********************************************* PROJECT DRAW *****************************************************************
        
        //********************************************************** NOTE *******************************************************
        doc.autoTable(columnsNote, [{c2:"OBS: ", c3:"", c4:"ACABAMENTO: __________", c5:"", c1:"", c6:"ASSINATURA", c7:""}, {c2:"", c3:"", c4:" Início:  ____/____/____", c5:"", c1:"", c6:"", c7:""},{c2:"", c3:"", c4:" Fim:    ____/____/____", c5:"", c1:"", c6:"__________________", c7:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 300, fontStyle: 'bold', halign: "left"},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c4: {cellWidth: 100, halign: "left"},
                            c5: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c6: {cellWidth: 80, fontStyle: 'bold', halign: "center"},
                            c7: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", cellPadding: 1.3, fontSize: 12},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** NOTE *******************************************************
        
        doc.save('OS ' + so.id + ' ' + so.store + ' (' + so.client + ') ' + so.item + '_' + so.ambient +'.pdf');
        
    }
    
  ngOnInit() {
  }

}
