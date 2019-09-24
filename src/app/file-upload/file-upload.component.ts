import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DATA_API } from '../app.api'

@Component({
  selector: 'sivp-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent{

public uploader:FileUploader = new FileUploader({url: `${DATA_API}/fileDropTest`});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
 
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}
