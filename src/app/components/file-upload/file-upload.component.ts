import { Component, OnInit, forwardRef } from '@angular/core';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { ResponseModel, _BlobModel } from '../../models/dto';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type CallbackType = (value: string) => void;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    FileService,
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
  changeCb: CallbackType;
  touchCb: CallbackType;
  id: string;
  step = 0;
  error: string;
  showAlert: boolean;
  _value: _BlobModel;
  set value(obj: _BlobModel) {
    this._value = obj;
    if (this.changeCb) {
      if (obj)
        this.changeCb(obj.blobId);
      else
        this.changeCb(null);
    }
  }
  get value(): _BlobModel {
    return this._value;
  }

  constructor(protected fileService: FileService) { }

  ngOnInit() {
    this.id = getGuid();
  }

  fileSelected(event: Event) {
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.step = 1;
      this.fileService.upload(element.files[0])
        .subscribe(response => {
          this.value = response.object;
        }, (response: ResponseModel) => {
          this.step = 0;
          this.error = response.errors[0];
          this.showAlert = true;
        });
    }
    else
      console.error("No file selected");
  }

  onErrorClose(reaspon: string) {
    this.showAlert = false;
  }

  writeValue(value: _BlobModel): void {
    this.value = value;
  }

  registerOnChange(cb: CallbackType): void {
    console.debug('register on change');
    this.changeCb = cb;
  }

  registerOnTouched(cb: CallbackType): void {
    console.debug('register on touch');
    this.touchCb = cb;
  }

}
