import { Component, OnInit, forwardRef, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { getGuid } from '../../utils/index';
import { FileService } from '../../services/file.service';
import { ResponseModel, _BlobModel } from '../../models/dto';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from "rxjs";
import { Observable } from 'rxjs/Rx';
import { NotificationService } from '../../services/notification.service';
import { BaseComponent } from '../../base.component';

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
export class FileUploadComponent extends BaseComponent implements OnInit, ControlValueAccessor, OnDestroy {
  changeCb: CallbackType;
  touchCb: CallbackType;
  id: string;
  _value: _BlobModel;
  subscription: Subscription;
  @Output() removed = new EventEmitter<any>();
  @Output() uploading = new EventEmitter<any>();
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
  }
  get value(): _BlobModel {
    return this._value;
  }

  constructor(protected fileService: FileService, protected notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.id = getGuid();
  }

  fileRemoved(index: number) {
    console.log(index);
  }

  fileSelected(event: Event) {
    let element: any = event.srcElement;
    if (element.files && element.files.length > 0) {
      this.value = <_BlobModel>{};
      this.uploading.emit();
      this.subscription = this.fileService.upload(element.files[0])
        .subscribe(response => {
          this.value = response.object;
        }, (response: ResponseModel) => {
          this.notificationService.error("file|fail", response.errors[0]);
          this.deleted();
        });
    }
    else
      console.error("No file selected");
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
    let tmp: Observable<any>;
    if (!this.subscription.closed) {
      tmp = Observable.of(null);
      this.subscription.unsubscribe();
      console.debug("Canceling request");
    } else {
      tmp = this.fileService.remove(this.value);
      console.debug("Removing file from backend");
    }
    this.subscriptions.push(tmp.subscribe(response => {
      this.removed.emit();
      this.subscription = null;
      this.value = null;
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
