import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {ProjectModel}  from  '../create-pdf-project/project.model';
import {CreatePdfProjectComponent}  from  '../create-pdf-project/create-pdf-project.component';
import {AppService} from '../app.service';
import { BudgetNew } from '../budget/budget-new/budget-new.model';
import {BudgetItem} from '../budget/budget-item.model';
import {ProjectDraw} from './project.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {ImgSrc} from './img-src';

@Component({
  selector: 'sivp-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css']
})
export class FileDropComponent implements OnInit{

    constructor(private formBuilder: FormBuilder, private createPdf: CreatePdfProjectComponent, private appService: AppService, private spinner: NgxSpinnerService){}
    
    projectForm: FormGroup;
    formMaterial: FormGroup;
    //createPdf= {} as CreatePdfProjectComponent;
    pModel: ProjectModel;
    budgets: BudgetNew[] =  [];
    budgetItems: BudgetItem[] = [];
    projectDraw = {} as ProjectDraw;
    self: any;
    public files: NgxFileDropEntry[] = [];
    imageSrc: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAARSURBVChTY/hPBBjxiv7/BwDkUx7w62JyhgAAAABJRU5ErkJggg==";
    currentItem: number = -1;
    drawId: number;
    materials: Object[];
    currentMaterial: number = 1;
    currentItemMaterial: number = -1;
    currentItemDraw: number = -1;
    images: ImgSrc[] = [];
    storeName: string = "";
    clientName: string = "";
    isBudget: boolean = false;
    materiais: string[] = [];
    ambients: string[] = [];
    locals: string[] = [];
    budgetId: string;
    imagesSrc: string[] = [];
    materiaisId: string[] = [];
    enableGenerateDraw: boolean = false;
    releaseAmbient: boolean = false;
    releaseMaterial: boolean = false;
    
  public dropped(files: NgxFileDropEntry[]) {
    //this.files = files;
      this.files = this.files.concat(files);
      
      console.log(files);
    for (const droppedFile of files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
            var pattern = /image-*/;
        var reader = new FileReader();
        if (!file.type.match(pattern)) {
          alert('invalid format');
          return;
        }
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
            
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
    clickRow(i: number){
        this.currentItem = i;
        this.projectDraw.approved = false;
        this.projectDraw.budgetItem = this.budgetItems[i]['id'];
        this.projectDraw.image = this.imageSrc;
        console.log(this.projectDraw);
    }
    
    
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }
    
    handleInputChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        var pattern = /image-*/;
        var reader = new FileReader();
        if (!file.type.match(pattern)) {
          alert('invalid format');
          return;
        }
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }
    
    _handleReaderLoaded(e) {
        let reader = e.target;
        this.imageSrc = reader.result;
        this.imagesSrc.push(this.imageSrc);
        this.images.push({img: this.imageSrc});
        this.ambients.push('');
        this.materiais.push('');
        this.locals.push('');
        console.log(this.imagesSrc);
        console.log(this.imageSrc);
        this.projectForm.get('txtImage').setValue(this.imageSrc);
        //var param = {idOs: this.parameterService.getIdOs(), image: this.imageSrc};
    }
    
    initializeProjectModel(): ProjectModel{
        var pModel = {} as ProjectModel;
        pModel.ambient = "";
        pModel.client = "";
        pModel.image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAARSURBVChTY/hPBBjxiv7/BwDkUx7w62JyhgAAAABJRU5ErkJggg==";
        pModel.item = "";
        pModel.material = "";
        pModel.name = "";
        pModel.store = "";
        return pModel;
    }
    
    submitBudget(){
        var self = this;
        var params = {budgetId: this.projectForm.get('txtBudget').value};
        self.spinner.show();
        this.appService.postBudgetClientStore(params).subscribe(function(data){
            console.log(data);
            if(data.length > 0){
                self.storeName = data[0]['nameStore'];
                self.clientName = data[0]['nameClient'];
                self.budgetId = data[0]['id'];
                self.isBudget = true;
            }else{
                alert("Orçamento não encontrado");
            }
           self.spinner.hide(); 
        });    
    }
    
    exportPdf(){
        this.spinner.show();
        var self = this;
        var params = {approved: 0, image: self.imageSrc, budget: self.projectDraw.budgetItem, material: this.currentMaterial};
        console.log(params);
        self.appService.insertDraw(params).subscribe(function(data){
            console.log(data);
            self.drawId = data['insertId'];
            self.appService.draw(self.projectForm.get('txtBudget').value).subscribe(function(data){
                console.log(data);
                self.pModel.ambient = self.budgetItems[self.currentItem].ambient;
                self.pModel.client = data[3][0]['nome'];
                self.pModel.image = self.imageSrc;
                self.pModel.item = self.budgetItems[self.currentItem].item;
                self.pModel.material = self.projectForm.get('txtMaterial').value;
                self.pModel.store =  data[2][0]['nome'];
                self.pModel.name = "Desenho " + self.drawId + " " + self.pModel.client + " (" + self.pModel.store + ")";
                self.pModel.local = "";
                console.log(self.pModel);
                self.createPdf.gerarPDF(self.pModel);
                alert("Desenho criado");
                self.spinner.hide();
            });
        });
    }
    
    submitDraw(){
        this.spinner.show();
        var self = this;
        console.log(self.locals);
        var query = "";
        var params = {query: ""}
        self.images.forEach(function(data, index){
            
            params.query =  "(0,'" + self.images[index].img + "'," + self.budgetId + "," + self.materiaisId[index] + ",'" + self.ambients[index] + "','" + self.locals[index] + "')"
            self.appService.insertDraw(params).subscribe(function(data){
                var drawId: number = data['insertId'];
                self.pModel.ambient = self.ambients[index];
                self.pModel.client = self.clientName;
                self.pModel.image = self.images[index].img;
                self.pModel.item = "";
                self.pModel.material = self.materiais[index];
                self.pModel.local = self.locals[index];
                self.pModel.store =  self.storeName;
                self.pModel.drawId = drawId.toString();
                self.pModel.budgetId = self.budgetId;
                self.pModel.name = "Desenho " + drawId + " " + self.pModel.client + " (" + self.pModel.store + ")";
                self.createPdf.gerarPDF(self.pModel);
                if(index == self.images.length - 1){
                    self.spinner.hide();
                    alert("Desenhos criados");
                }
            })
        })
    }
    
    
    
    runDraw(){
        var self = this;
        var objs: Object[] = [];
        this.appService.findBudgetItems(this.projectForm.get('txtBudget').value).subscribe(function(data){
           
            objs = Object.assign(objs, data);
            objs.forEach(function(value){
                let b = {} as BudgetItem;
                b.id = value['id'];
                b.ambient = value['comodo'];
                b.budget = value['orcamento_id'];
                b.cod = value['codigo'];
                b.detail = value['detalhe'];
                b.discount = value['desconto'];
                b.discountValue = value['valorComDesconto'];
                b.item = value['item'];
                b.measure = value['medida'];
                b.necessary = value['necessidade'];
                b.number = value['numero'];
                b.qtd = value['quantidade'];
                b.totalValue = value['valorTotal'];
                b.unitValue = value['valorUnitario'];
                self.budgetItems.push(b);
            });
            document.getElementById("openModalButton").click();
        });
        
    }
    
    clickRowMaterial(i: any){
        this.currentItemMaterial = this.materials.indexOf(this.materials.find(function(data){
            return data['id'] == i;
        }));
    }
    
    clickRowDraw(i: number){
        this.currentItemDraw = i;
        this.projectForm.get('txtAmbient').setValue(this.ambients[this.currentItemDraw]);
        this.projectForm.get('txtMaterial').setValue(this.materiais[this.currentItemDraw]);
    }
    
    openModalMaterial(){
        var self = this;
        this.appService.materials().subscribe(function(data){
            console.log(data);
            self.materials = data;
            document.getElementById('openModalMaterial').click();
        })
    }
    
    setMaterial(){
        console.log(this.materials);
        this.projectForm.get('txtMaterial').setValue(this.materials[this.currentItemMaterial]['nome']  + " " + this.materials[this.currentItemMaterial]['tamanhoComercial'] + " (" + this.materials[this.currentItemMaterial]['tamanhoReal'] + ")");
        this.currentMaterial = parseFloat(this.materials[this.currentItemMaterial]['id']);
        this.materiaisId.push(this.materials[this.currentItemMaterial]['id']);
    }
    
    openModalAddMaterial(){
        document.getElementById('openModalMaterialButton').click();
    }
    
    insertMaterial(){
        var self = this;
        var obj = {name: this.formMaterial.get('txtName').value, comercialSize: this.formMaterial.get('txtComercialSize').value, realSize: this.formMaterial.get('txtRealSize').value};
        this.appService.insertMaterial(obj).subscribe(function(data){
            console.log(data);
            alert("Material Inserido");
            self.appService.materials().subscribe(function(data){
                self.materials = data;
            });
        })
    }
    
    ngOnInit(){
        this.self = this;
        var self = this;
        this.projectForm = this.formBuilder.group({
            txtAmbient: this.formBuilder.control(''),
            txtClient: this.formBuilder.control(''),
            txtItem: this.formBuilder.control(''),
            txtMaterial: this.formBuilder.control(''),
            txtImage: this.formBuilder.control(''),
            txtStore: this.formBuilder.control(''),
            txtLocal: this.formBuilder.control(''),
            txtBudget: this.formBuilder.control('', [Validators.required])
        });
        
        this.formMaterial = this.formBuilder.group({
            txtName: this.formBuilder.control('', [Validators.required]),
            txtComercialSize: this.formBuilder.control(''),
            txtRealSize: this.formBuilder.control(''),
        });
        
        this.projectForm.get('txtMaterial').valueChanges.subscribe(function(data){
            setTimeout(()=>{
                self.materiais[self.currentItemDraw] = data;
                
                if(self.materiais.find((v) => v == "") == undefined){
                   self.releaseMaterial = true; 
                }else{
                    self.releaseMaterial = false;
                }
                
                if(self.releaseMaterial && self.releaseAmbient){
                    self.enableGenerateDraw = true;
                } else{
                    self.enableGenerateDraw = false;
                }

            }, 50);
        });
        
        this.projectForm.get('txtAmbient').valueChanges.subscribe(function(data){
            setTimeout(()=>{
                self.ambients[self.currentItemDraw] = data;
                
                console.log(self.ambients.find((v) => v == ""));
                
                if(self.ambients.find((v) => v == "") == undefined){
                   self.releaseAmbient = true; 
                    console.log("ambient true");
                }else{
                    self.releaseAmbient = false;
                    console.log("ambient false");
                }
                
                if(self.releaseMaterial && self.releaseAmbient){
                    self.enableGenerateDraw = true;
                } else{
                    self.enableGenerateDraw = false;
                }
            }, 50);
        });
        
        this.projectForm.get('txtLocal').valueChanges.subscribe(function(data){
            self.locals[self.currentItemDraw] = data;
        })
        
        this.pModel = this.initializeProjectModel();
    }
    
}
