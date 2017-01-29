import { Component, OnInit } from '@angular/core';
import { P2PModel, _BlobModel } from '../../../models/dto';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { P2pService } from '../../../services/p2p.service';
import { NotificationService } from '../../../services/notification.service';
import * as _ from 'lodash';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-p2p-create',
  templateUrl: './p2p-create.component.html',
  styleUrls: ['./p2p-create.component.scss'],
  providers: [P2pService]
})
export class P2pCreateComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  get value(): P2PModel {
    let ret: P2PModel = _.cloneDeep(this.form.value);
    ret.blobs = _.without(ret.blobs, null);
    return ret;
  }

  constructor(protected p2pService: P2pService, protected notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    let initial = {
      title: new FormControl(),
      text: new FormControl(),
      fosId: new FormControl(),
      blobs: new FormArray([]),
      chargePerMinute: new FormControl(),
      deadline: new FormControl()
    };
    this.form = new FormGroup(initial);
    this.newFile();
  }

  getBlobControl(): FormArray {
    return <FormArray>this.form.controls['blobs'];
  }

  blobs(): _BlobModel[] {
    return this.getBlobControl().getRawValue();
  }

  newFile() {
    this.getBlobControl().push(new FormControl());
  }

  fileRemoved(index: number) {
    this.getBlobControl().removeAt(index);
  }

  submit() {
    this.subscriptions.push(this.p2pService.create(this.value).subscribe(response => {
      this.notificationService.info('p2p created');
      this.form.reset();
    }));
  }

}
