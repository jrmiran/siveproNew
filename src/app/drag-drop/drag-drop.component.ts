import { Component, OnInit, ViewChild } from '@angular/core';
//import { FileHandle } from '../shared/dragDrop';
//import { DndDropEvent } from 'ngx-drag-drop';
//import {DATA_API} from '../app.api';


@Component({
  selector: 'sivp-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements OnInit{
    
    /*@ViewChild('fileSelector') fileSelector;
    
    afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI:  {
      url:`${DATA_API}/fileDropTest`,
      headers: {
     "Content-Type" : "text/plain;charset=UTF-8",
      }
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true
};
    
    DocUpload(e){
        console.log(e);
    }*/
    
   ngOnInit(){
       console.log("On Init");
       //console.log(this.fileSelector.selectedFiles)
   }

}