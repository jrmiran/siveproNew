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

    belartteLogo = "iVBORw0KGgoAAAANSUhEUgAAAMcAAAAyCAQAAABCUwfnAAABG2lDQ1BpY2MAACjPY2BgMnB0cXJlEmBgyM0rKQpyd1KIiIxSYD/PwMbAzAAGicnFBY4BAT4gdl5+XioDBvh2jYERRF/WBZnFQBrgSi4oKgHSf4DYKCW1OJmBgdEAyM4uLykAijPOAbJFkrLB7A0gdlFIkDOQfQTI5kuHsK+A2EkQ9hMQuwjoCSD7C0h9OpjNxAE2B8KWAbFLUitA9jI45xdUFmWmZ5QoGFpaWio4puQnpSoEVxaXpOYWK3jmJecXFeQXJZakpgDVQtwHBoIQhaAQ0wBqtNAk0d8EASgeIKzPgeDwZRQ7gxBDgOTSojIok5HJmDAfYcYcCQYG/6UMDCx/EGImvQwMC3QYGPinIsTUDBkYBPQZGPbNAQDAxk/9PAA7dgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfjDAQTCBmkRIY7AAABX3pUWHRSYXcgcHJvZmlsZSB0eXBlIGljYwAAOMudVNmNhDAM/U8VW4Jvk3KYQKTtv4F1IGFghTSHUUB6duzni/RbSvppogYJmhCDoIiQKBBukC22ujgpiQsR6KRZZwLwUps6DsNJkqGxs4cjBQUpQ2Gr1TgKb0iNqI0RDmBhWg5mH0r60H4O/uDk0rn0DJiSiamz7fniSNse7lEh6Bcw9wsoRqE78AcMPEU5JQraHZUeCVbzM7488Yv9euDN0daPXVHliOwnnGB6MjrjWJ6MWmrTyBlA2GpQz06WzS00BIyc20PR2yhFjfQ0BoLDitt9W5xTKHO0uV0nh/Y23JTd9aWGhyBeXMaspTZsNPWYE+VP2/5t+793dKzGSSprG+IxyIgWS3dneCcxiBpVtH8wxp5u9UuvDF7pB5FLarngNi9S533XpJY7xizT0r4z0D5HNettamSMPWz7ZcBjzSX9AXdD5+HfdPh2AAANKElEQVR42u3beZTVxZUH8M9bml6Qhha7aQQ31iAgAopiXHBLCJo4ORLjaEaT6JzJ5sRkhsmZk2VMTozRrGomGeLEJCYymtU4mdFoXJhojKIGxSiKBoUIiiBC78t7d/54v/7xuulmEz1nhv6+czivqm7dW3W/t6pu1WsYxCAGMYhBDGIQgxjEIP4fIrO3FMUbqXyfQXZvKIkeMoaZImOIyfKl+kG8yYieTz5Oi9vie5GJurgzvhvTe1oG8aYhJWNWXB9bImJJiBHxx4hYE5+PgwcpedOQUjE+roz1UUKJjkeT0hPx0Ri5b1LSM+uKN9NYjIp/iGdiG/4jxIhYnpYLcV+cEzX7HiUhMm/KrFMqhsUF8VAUy8h4ON4VIh+XxvNlte3xqzg18vsWJSHq4q/e4O06pWJIvCNuj84yp6+KRdGYtk+Jq+OVstbX4nsxc18iJEQ2psQH4l1R9wbNO1GbiWPix9FU5uz1cVVMCCEOj6/HZ2JMCDE3lkRzmdS6uCLG7SuUJPOsiDlxccyL6r087zTuJ8c3YkOZk7fE92N2CDEmPh2rIyJieVwUw0MMiTPijl5r6On4RDTsytBir312pn3vWuvnUxnz4sKY0XOW7Ai7dHFOVRzoQn/rsLShw52uca8uDHeT+WlLt6W+6Q6dar3bJWaXKVvmWrdo3vEAglGOVCsnvKRLnS4veF4HKs1UrwLdOpGRkVMpo2C1GrWq0a7VM9Zl+teeNc9LniyNIKhwtHrVaNam2lDt1nhGi5wTjNKtRZehhqBZQZUqGc+rN1SnFkW1ssIWOVWqdFprpFoZRa3qHW+9H1u1G27fYRyNiIvjj2VxXojfx7kxtCzHejp6ozlujGNCiMZYFKvKWjritpgfFTuJ3+FxQqyMiI1xWhwc7457Yn3cEqeEyMdb4taIiPhVzI23xvFxUsyPS+PhiPhUjIt/jYiIH8SUqIuB5nRQPBc3Rz5dHbmYEFdHRMQ1MTmOj0XxdGyO2+LYqIn74tG4OI6NmXF3RBTji3FEnBafirWxJNbELXF2zIzTY00UoynOi1lxRlwbG2JhnB2vRTGa4uKYE3Pj1PibOCdG7/G2lbq6Ns6Ne6OrzKFPxiVxQAhxQpwf2RAN8VRsj5fjazExhJgQX0lvJxERW+NHMWfgBZyEwPKIeDkmhxATY3lErIt5IcQNERHx7722hYmxLD4R4rKIiPjaDnUvjEL8paQ5nek/RUTEZUnpbbEpIh6PmfGLODZKh3MpCC5JJC6Jn8XPoz6EGBurI6I55iZnxuI4JabF5ojYGkenp+60+EAsiOEDUTLgm1UqvL/z3eKHTiq9Q4GbzXetjSb7pludUaa3092WlZUbfNJtFhnlWYucZXnaMsz7/KevmtTLWooM5OSRkwOrLMZo5yttT6lYT8Eq1+rqqS3NbYBtIePtssY4uaeY2eaNni73ehDTvdMKj1E2klwicZfNlnolsZYrk+jyG92pXC5RGp5wo80WOkFVf/PO6wepSKOzXOio7a6W91tjPx/yYeNQSCYRHvVNv1TjAn9nQio93lXO8TU/85CVjizT0+CTznKdG6wvWe3jvE5LvWiTpqS8QouhxqnS3u94WVp2sg2AKM1sDljg+zoGEOz0UjL+ZTpB0UPyilaXpmuTLdYn0m3u1qjVq0n5xd6ejm1aH/CEuc7ziBWKRNms+6yOsiV0qEVu921z+7nnZ/EWnzUuIaI0nM8704802+CrFvh6EjUlHOUyB+gvWMf7sl/7oOE99suQs796I9Moq5LDFt3b6Wk0Arzgf3ZGB5hqmXYcY/KAL89Z+4G1HklDbrh69SoTiSb3W5lMKm9kz1gzJTrW9xll3iFJTZM7/Np45zloe8duz+Akn3eHq8xI2wvu8ZNePXN9jG11cxoprPKP3mlJT/6EXC9bzb7rybQ0y2I/987SNMsoyTvCTLNLC1vGAlW63ap7O9cd55DkW3EXyMia4Dp/RoNTB5QabzbW+qkHkpqMt5hptsak3OqXViTfK800y1EJhfzF2j7BXuttsmlEbvALDxg6IB1RKk/0Rb/xORPLpFb4mLPcuQsT5WAHJOoe9AEXphT1Dvxu/+YdvmRd6vhT3eSH3loaUSpaRNEwI0xxmYtsdGWvsCgJDnNKKSp3nkAmW1XWw+4FC9T0EcmgynRXOdgTLk3OjRIKZVb7Ki6g0G9bKUSONrH0LR3nc1b2Fux7dszxnV67Oy+43vette0AGxiNLnCRV13jVi3o9Btrje5HMiNrjU/7qY9amGw0Nd7rdDe50ppespVONteJ5su63Le0lrVN8fdGmGO263Y6uvJef1Zwm4tUmm2qZeX7t8neZ7qzHWaxr1jdw1C/ycYA6CU/xHsdb4yz3bWtsv/efelY4TIfMc8QsMlNvl22qexIV85Ci5Lr3kx3utwfbL+l9cVyH7bEx7092ZCy8n3WBx3+25N+6HhX+mdH+pxn07YNfidntYbduFlljHc7HvK0I9R5m2W92le7xV0ecYVztPuC13ZZc//o9qin1Bq288tGXzpa/Mrd3uVjprjD1R4oLa8GGwbWUTJS57OmJjWVzvSaB/sxv73Tut3jQWf4uOl+62r3K6DSBM+lS7+oaIv/MsQSf22482xJem/0RzysTnbHPwaXtTUYYoMKr7rXEXi7azSVtXdq1uwn9vcdn7DRl14nHUXPeBQvOFdWscdSf/FTRke6wJrc6E6HWqFt4I7bVWb7bGZ5mV45XD99UoutfuoeEzyebkQFDeZYo6KXJ+/znKlOcZS7+mh8JE2GB0aDZq043DjnyulW1KXCDDPc14/877yi3nsstul1ElI6oTd4fGdruM/qSB20oWc5vNF/DZJa3GhjT02U1ky9UzQjmxLS5CVTVRmznZqelVjvMA9tbyXgWE/4M8a5zhpZ4R4nmanW/H7p2ORV9cYa/brpKKHVnUkqcIznembbG/3cyjO9PnuMvhfOHSjrazERfMXNFrrcenWJYE4Vir0vgaA7mWhjumFujwNkUa/as1o0abbGb8HpqYVyNNuE6iTReP2I5DLJkYb1L7Lnf9iT6bM5bfYVf0qdc5fr+tARfW4EmR0rT5pf8Bnvc7j5anGQw7DRUwNIc3h/zguoME0GU63TlZq/XQummdXPINptQIXavfEnSmVjrDFj4Jvn7mgsx0aP9bqOdbneAl+wxmM+5Gz39Or1uCtsKtOws4yr3NzjfqTJe5zkUgfqttifenxc+jddiIf5mMq0rdir7UTzdGGmJ9KOPGwFaizY1iN1VbfHMER9WllIWorliz/5VkwGXSx72+gJwEKZfN4FThzospq361jhMTPS0ipnOd35TpZPR7bGv7hRixd7efV5i91gnW3kd1uaXgB3QkhAh/utMM80z/uyH8iaplYHRnmHjKy8oQ52plnuME2DdtR7q7y8vCrjvF+1ceZZqFmtP2lDrUmeNVOY5zRbjNGO0Y7ylBb82ElOdKaV1ljvMAeq1qHoYLM9m2Z35EwyQUGbdtO0W6kTDabr0KbDMUaokJVX5zhn2ZQSO1AI7gwBY73fRQ71Sd9Iqqsd52TL3Z0+nfV25VDv8YCnk8qsmy30iG/5pS27bjxd2aUnjd970WTD5ZS2wNJxk5UTCjaoVpX8NFVIjqOsPNo0GSmnoMVT2jHMJBXJm1ynorw8CtqtTHK8BkcZ4RWP2eBQDSpklX70WmVrpmd0OZPsp1JG6NJqpS6McoghMkIxyTEzcrKK2jyuo7/Z7x4dMMVHLHNDpvzWeYwjrPRAT5qa6dtHki/lXG6r65OX0t1KFFJd4x2n2dK+9P/fw+uig7oeD+RUak0jo4Rhjneohz1aWoZ9WnvWSsZ+PfeDPcnZosf+dLOs9QdNqhxks42oN9zLmuQdqNVGNNqswxCNmr2KMdplbExCgzEqrddmmBqtarycjjNvfxuQ1Yj1Qka9TQoyDhLWKWCkFu1o1GKoZs2qjbXVyzLGaJOxUYVDhBd0q9FgkyYZjTJeUuzPA7txlG/ucWFh26tRmi80uc3PjfPB0s9J21p7pctRImNPE+jU/nJLdDoaQ9RoVIUD1CX3+cbSY706eYyWT95NDzHV/mXqRqtRQLUZphpVRvkBZqlBrWHaZbGf2eoQxppoKPJmJM/jo0x1hGpUGauIcIipRqCQbE+M1eUgGVmj7D/Q+99uJrr93UfS0gY3u9ek5PVpl/ruPiFJ73ZLLQWVCrqVsp4hKGpTXWakzdAky9+qpZey7uTXxqJ2lT0vEGCkV9WjU06tDOptSn6v6UqCsU6LYXJoU6k9yZW6VCJjS2KrqEWrItoM0y7QqnIgv+/FS3fvk+KNRWorp0a7LlSq1KZLRo0unajSqdir3C0U0nytWl6rgnySG3ak21ilbrmkT0YbhijI60AN2oQKIatLJAR065ZTo1vbNluoQBeyarQpbNP5Os+O3SHkzfmPNnt2OcvsoGdmD3Xu6TgGMYhBDGIQgxjEIAYxiEEMYhD7NP4XzMXma0V/cXsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTItMDRUMTk6MDg6MjUrMDA6MDAIoO+PAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTEyLTA0VDE5OjA4OjI1KzAwOjAwef1XMwAAADd0RVh0aWNjOmNvcHlyaWdodABDb3B5cmlnaHQgMTk5OSBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZDFs/20AAAAgdEVYdGljYzpkZXNjcmlwdGlvbgBBZG9iZSBSR0IgKDE5OTgpsLrq9gAAAABJRU5ErkJggg==";
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
                          {theme: 'striped', 
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
                          {theme: 'grid', 
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
                          {theme: 'grid', 
                           columnStyles: {
                                        valor: {fillColor: [0,0,0]}
                                      },
                          styles: {halign: "center", cellPadding: 0, fontSize: 1},
                          margin:{top:0, left: 450, right: self.defaultMarginRight},
                           showHead: "false",
                           startY: doc.previousAutoTable.finalY 
            });
        }
        
        //********************************************************** TITLE *******************************************************
        lineTop();
        doc.autoTable([{title: "", key:"c1"},{title: "", key:"c2"},{title: "", key:"c3"}], [{c1: "", c2: "PROJETO EXECUTIVO", c3: ""}], {theme: 'grid', 
            columnStyles: {
                            c1: {cellWidth: 1, fillColor: [0,0,0]},
                            c2: {cellWidth: 481, halign: "center"},
                            c3: {cellWidth: 1, fillColor: [0,0,0]},
                          },      
            bodyStyles: {lineColor: [0, 0, 0]},
            styles: {halign: "center", fontSize: 12, cellPadding: 0, fontStyle: "bold", font: "times"},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** TITLE *******************************************************
        
        //********************************************************** SO DATA *******************************************************
        //lineTop();
        /*doc.autoTable(columnsInfo1, [{c2: "Loja: " + project.store, c3: "Cliente: " + project.client, c1:"", c4:"", c5:"Pjt.: "+ project.drawId+"   Orc.: " + project.budgetId, c6:""}, {c2: "Material: " + project.material, c3: "Corredor: " + project.local, c1:"", c4:"", c5:"OS: ", c6:""}, {c2: "Ambiente: " + project.ambient, c3: "Acabamento:  ", c1:"", c4:"", c5:"Ass.: ", c6:""}], {theme: 'grid', 
            columnStyles: {
                            c1: {cellWidth: 1, fillColor: [0,0,0]},
                            c2: {cellWidth: 200, halign: "left"},
                            c3: {cellWidth: 200, halign: "left"},
                            c4: {cellWidth: 1, fillColor: [0,0,0]},
                            c5: {cellWidth: 80, halign: "left"},
                            c6: {cellWidth: 1, fillColor: [0,0,0]}
                          },
            rowStyles: {
                            0: {cellHeight: 0.5}    
            },              
            bodyStyles: {lineColor: [0, 0, 0]},
            styles: {halign: "center", fontSize: 11, cellPadding: 2},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });*/
        doc.autoTable(columnsInfo1, [
            {c2: "Loja: " + project.store + "\nCliente: " + project.client, c3: "Corte:\nI:  ___:___    ___/___/___   F:  ___:___    ___/___/___", c1:"", c4:"", c5:"Pjt.: "+ project.drawId+"   Orc.: " + project.budgetId, c6:""}, 
            
            {c2: "Material: " + project.material + "\nCorredor: " + project.local, c3: "Esquadria:\nI:  ___:___    ___/___/___   F:  ___:___    ___/___/___", c1:"", c4:"", c5:"OS: ", c6:""}, 
            
            {c2: "Ambiente: " + project.ambient, c3: "Acabamento: ___________________________\nI:  ___:___    ___/___/___   F:  ___:___    ___/___/___", c1:"", c4:"", c5:"Ass.: ", c6:""}
        
        ], {theme: 'grid', 
            columnStyles: {
                            c1: {cellWidth: 1, fillColor: [0,0,0]},
                            c2: {cellWidth: 240, halign: "left"},
                            c3: {cellWidth: 160, halign: "left"},
                            c4: {cellWidth: 1, fillColor: [0,0,0]},
                            c5: {cellWidth: 80, halign: "left"},
                            c6: {cellWidth: 1, fillColor: [0,0,0]}
                          },
            rowStyles: {
                            0: {cellHeight: 0.5}    
            },              
            bodyStyles: {lineColor: [0, 0, 0]},
            styles: {halign: "center", fontSize: 11, cellPadding: 2},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();
        //********************************************************** SO DATA *******************************************************
        
        //********************************************************** ITEM *******************************************************
        /*doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c2: project.item + " - " + project.ambient, c1:"", c3:""}], {theme: 'plain', 
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 483, halign: "center"},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]}
                          },
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 1) {
                    var base64Img = this.projectDraw;
        
                    doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 675, data.cell.y + 395);
                }
            },
            styles: {halign: "center", cellPadding: 1, fontSize: 12},                       
            margin:{left: self.defaultMarginLeft, top: 50, right: self.defaultMarginRight},
             startY: doc.previousAutoTable.finalY                  
        });
        lineBottom();*/
        //********************************************************** ITEM *******************************************************
        
        
        //********************************************* PROJECT DRAW *****************************************************************
        doc.autoTable([{title: "", key:"c1"}, {title: "", key:"c2"}, {title: "", key:"c3"}], [{c1:"",c2:"",c3:""}],{showHead: 'false', theme:'grid',
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 1) {
                    var base64Img = this.projectDraw;
        
                    doc.addImage(project.image, 'PNG', data.cell.x + 1, data.cell.y + 1);
                }
                if (data.section === 'body' && data.column.index === 1) {
                    var base64Img = this.projectDraw;
        
                    //doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 675, data.cell.y + 385);
                    doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 1, data.cell.y + 390);
                }
            },
            bodyStyles: {lineColor: [0, 0, 0]},
            columnStyles: {
                            c1: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                            c2: {cellWidth: 483, fontStyle: 'bold'},
                            c3: {cellWidth: 1, fontStyle: 'bold', fillColor: [0,0,0]},
                          },    
            styles: {halign: "center", cellPadding: 175, fontSize: this.defaultFontSize},                                   
            margin:{left: self.defaultMarginLeft, right: self.defaultMarginRight},
            startY: doc.previousAutoTable.finalY  
        });
        
        lineBottom();
        //********************************************* PROJECT DRAW *****************************************************************
        
        //********************************************* PROJECT DRAW *****************************************************************
        doc.autoTable([{title: "", key:"c1"}], [{c1:"Belartte Design em Acabamentos \nRua Itanhaém, 2457 - Ribeirão Preto \n(16) 3628-5268 / (16) 98131-5225"}],{showHead: 'false', theme:'grid',
            didDrawCell: data => {
                if (data.section === 'body' && data.column.index === 0) {
                    var base64Img = this.projectDraw;
        
                    //doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 675, data.cell.y + 385);
                    doc.addImage(this.belartteLogo, 'PNG', data.cell.x + 650, data.cell.y + 2);
                }
            },                                                                                                        
            bodyStyles: {lineColor: [0, 0, 0]},
            columnStyles: {
                            c1: {fillColor: '#513e50', fontStyle: 'bolditalic', textColor: [255,255,255], font: 'times'},
                          },    
            styles: {halign: "left", cellPadding: 6, fontSize: this.defaultFontSize, fontColor: [255,255,255]},                                   
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