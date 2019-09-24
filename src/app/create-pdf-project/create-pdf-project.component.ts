import { Component, OnInit, Injectable } from '@angular/core';
import {BudgetAmbient} from '../budget/budget-new/budget-ambient.model'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {BudgetPdf} from '../create-pdf/budget-pdf.model';
import {BudgetModel} from '../budget/budget.model';
import {AppService} from '../app.service';
import {ProjectModel}  from './project.model';

@Component({
  selector: 'sivp-create-pdf-project',
  templateUrl: './create-pdf-project.component.html',
  styleUrls: ['./create-pdf-project.component.css']
})

@Injectable()
export class CreatePdfProjectComponent implements OnInit {

   constructor(private appService: AppService) { }
    defaultFontSize: number = 10;
    defaultMarginLeft: number = 20;
    defaultMarginRight: number = 21;
    projectDraw = 'data:image/png;base64,MTE3LDExMCwxMDAsMTAxLDEwMiwxMDUsMTEwLDEwMSwxMDA=';
    belartteLogo = 'data:image/png;base64,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';
    
    rows: BudgetPdf[] = [];
    
    public gerarPDF(project: ProjectModel) {
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
        doc.autoTable(columnsInfo1, [{c2: "Loja: " + project.store, c3: "Cliente: " + project.client, c1:"", c4:"", c5:"", c6:""}, {c2: "Material: " + project.material, c3: "", c1:"", c4:"", c5:"", c6:""}], {theme: 'plain', 
        didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 4 && data.row.index === 0) {
                    var base64Img = this.projectDraw;
        
                    doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 6, data.cell.y + 5);
                }
            },
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 200, fontStyle: 'bold', halign: "left"},
                            c3: {cellWidth: 200, fontStyle: 'bold', halign: "left"},
                            //limitDate: {cellWidth: 140, fontStyle: 'bold', halign: "left"},
                            c4: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c5: {cellWidth: 80, fontStyle: 'bold', halign: "left"},
                            c6: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", cellPadding: 2, fontSize: 11},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** SO DATA *******************************************************
        
        //********************************************************** ITEM *******************************************************
        doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c2: project.item + " - " + project.ambient, c1:"", c3:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 483, halign: "center"},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            styles: {halign: "center", cellPadding: 1, fontSize: 12},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** ITEM *******************************************************
        
        
        //********************************************* PROJECT DRAW *****************************************************************
        doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c1:"",c2:"",c3:""}],{showHead: 'false', theme:'plain',
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 1) {
                    var base64Img = this.projectDraw;
        
                    doc.addImage(project.image, 'PNG', data.cell.x + 50, data.cell.y + 10);
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
        
        doc.save(project.name +'.pdf');
        
    }
    
  ngOnInit() {
  }

}