import { Component, OnInit, forwardRef, Input, EventEmitter } from '@angular/core';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { ResponseModel, _BlobModel } from '../../models/dto';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from "rxjs";

type CallbackType = (value: any) => void;

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
  error: string;
  showAlert: boolean;
  _value: _BlobModel;
  subscription: Subscription;
  removed: EventEmitter<any>;
  @Input() outputType = "object";
  set value(obj: _BlobModel) {
    this._value = obj;
    if (this.changeCb) {
      if (this.outputType == "object") {
        this.changeCb(obj);
      } else if (this.outputType == "id") {
        this.changeCb(obj ? obj.blobId : null);
      }
    }
    if (this.subscription && !obj)
      this.deleted();
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
      this.subscription = this.fileService.upload(element.files[0])
        .subscribe(response => {
          this.value = response.object;
        }, (response: ResponseModel) => {
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
    this.changeCb = cb;
  }

  registerOnTouched(cb: CallbackType): void {
    this.touchCb = cb;
  }

  deleted(): void {
    if (!this.subscription)
      return;
    if (!this.subscription.closed) {
      console.debug("Canceling request");
      this.subscription.unsubscribe();
    } else {
      console.debug("Removing file from backend");
      this.fileService.remove(this.value).subscribe(response => {
        this.value = null;
      })
    }
    this.subscription = null;
    this.removed.emit();
  }

}
