import { Component, OnInit } from '@angular/core';
import {AppService} from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProjectModel}  from  '../create-pdf-project/project.model';
import {CreatePdfProjectComponent}  from  '../create-pdf-project/create-pdf-project.component';
import {FormGroup, FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'sivp-search-project',
  templateUrl: './search-project.component.html',
  styleUrls: ['./search-project.component.css']
})
export class SearchProjectComponent implements OnInit {

    constructor(private appService: AppService, private route: ActivatedRoute, private spinner: NgxSpinnerService, private createPdf: CreatePdfProjectComponent, private formBuilder: FormBuilder) { }
    self: any;
    projects: Object[] = [];
    filteredProjects: Object[] = [];
    selectedRow: number = -1;
    currentDraw: string;
    currentDrawId: number = -1;
    currentMaterial: string;
    currentLocal: string;
    currentProject: any;
    currentStatus: any;
    projectData = {id: 0, ambient: "", store: "", client: "", budget: "", material: "", local: ""};
    pModel: ProjectModel;
    filterForm: FormGroup;
    status: string[] = ['Aprovado', 'Rejeitado'];
    
    clickRow(i: number){
        this.selectedRow = i;
    }
    
    setCurrentDraw(id: any){
        var self = this;
        this.spinner.show();
        this.appService.postImageDraw({drawId: id}).subscribe(function(data){
            console.log(data);
            self.currentProject = self.projects.find(data => data['id'] == id);
            self.currentDraw = data[0]['imagem'];
            self.currentDrawId = id;
            self.currentMaterial = self.projects.find(data => data['id'] == id)['material'];
            console.log(self.projects.find(data => data['id'] == id));
            console.log(self.projectData);
            self.spinner.hide();
        });    
    }
    
    exportPdf(){
        this.spinner.show();
        var self = this;
        var params = {approved: 0, image: self.currentDraw, budget: self.currentProject['budget'] + "", material: self.currentProject['material']};
                self.pModel.ambient = self.currentProject['ambient'];
                self.pModel.client = self.currentProject['client'];
                self.pModel.image = self.currentDraw;
                self.pModel.item = "";
                self.pModel.material = self.currentProject['material'] + " " + self.currentProject['tamanhoComercial'] + " (" + self.currentProject['tamanhoReal'] + ")";
                self.pModel.store =  self.currentProject['store'];
                self.pModel.name = "Desenho " + self.currentProject['id'] + " " + self.currentProject['client'] + " (" + self.currentProject['store'] + ")";
                self.pModel.drawId = self.currentProject['id'];
                self.pModel.budgetId = self.currentProject['budget'];
                self.pModel.local = self.currentProject['local'];
                console.log(self.pModel);
                self.createPdf.gerarPDF(self.pModel);
                alert("Desenho criado");
                self.spinner.hide();
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
        pModel.approved = false;
        this.currentProject = pModel;
        return pModel;
    }
    
    drawClickEvent(){
        console.log("Click event");
    }
    
    changeProjectStatus(status: boolean){
        this.spinner.show();
        this.appService.postUpdateProjectStatus({id: this.currentDrawId, status: status? 1 : 0}).subscribe((data) =>{
            this.projects.find((v) =>{return v['id'] == this.currentDrawId})['approved'] = status;
            this.filteredProjects.find((v) =>{return v['id'] == this.currentDrawId})['approved'] = status;
            this.spinner.hide();
        })
        
    }
    
    ngOnInit() {
        this.self = this;
        var self = this;
        
        this.filterForm = this.formBuilder.group({
            cbStatus: this.formBuilder.array([new FormControl(true), new FormControl(true)])
        });
        
        this.filterForm.get('cbStatus').valueChanges.subscribe((v)=>{
            this.filteredProjects = this.projects.filter((d)=>{
                if(v[0] && v[1]){
                    return true;
                } else if(v[0] && !v[1]){
                    return d['approved'] == 1;
                } else if(!v[0] && v[1]){
                    return d['approved'] == 0;
                } else if(!v[0] && !v[1]){
                    return false;
                }
            })
        })
        
        this.pModel = this.initializeProjectModel();
        if(this.route.queryParams['value']['clientId']){
            this.appService.postSearchProject({type: "Client", clientId: this.route.queryParams['value']['clientId']}).subscribe(function(data){
                data.map((v) =>{ v['approved'] = v['approved']['data'][0]});
                console.log(data);
                self.projects = data; 
                self.filteredProjects = self.projects;
            });
        } else{
            this.appService.postSearchProject({type: "All"}).subscribe(function(data){
                data.map((v) =>{ v['approved'] = v['approved']['data'][0]});
                console.log(data);
                self.projects = data;
                self.filteredProjects = self.projects;
            });
        }
    }

}