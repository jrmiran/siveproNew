import { Component, OnInit, Injectable, Input } from '@angular/core';
import {AppService} from '../app.service';
import {ParameterService} from '../shared/parameter.service';

@Component({
  selector: 'sivp-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

@Injectable()
export class UploadComponent implements OnInit {

  constructor(private appService: AppService, private parameterService: ParameterService) { }

  ngOnInit() {
  }
    @Input() title: string = "Selecionar Arquivo";
    imageSrc: string = '';
    imageBlob: any;
    idSO: any;
    
    handleInputChange(e) {
        console.log(this.parameterService.getIdOs());
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
    
    _handleReaderLoaded(e, callback) {
        let reader = e.target;
        this.imageSrc = reader.result;
        //console.log(this.imageSrc);
        //console.log(this.base64toBlob(this.imageSrc));
        this.blobToBase64(this.base64toBlob(this.imageSrc));
        //console.log(this.imageBlob);
        this.appService.insertImageSO(this.parameterService.getIdOs(), this.imageSrc).subscribe(function(data){
            console.log(data);
            alert ("Imagem inserida!");
        });
    }
    
    base64toBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        console.log(ia);
        var response = new Blob([ia], {type:mimeString});
        
            return new Blob([ia], {type:mimeString});
    }
    
    blobToBase64(blob){
        var self = this;
        var reader = new FileReader();
        var result;
        reader.onload = function(event) {
            self.imageBlob = event.target['result'];
            console.log(self.imageBlob);
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            
        };
        reader.readAsDataURL(blob);
    }
}
