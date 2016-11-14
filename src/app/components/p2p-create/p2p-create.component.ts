import { Component, OnInit } from '@angular/core';
import { P2PModel, _BlobModel } from '../../models/dto';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { P2pService } from '../../services/p2p.service';

@Component({
  selector: 'app-p2p-create',
  templateUrl: './p2p-create.component.html',
  styleUrls: ['./p2p-create.component.scss'],
  providers: [P2pService]
})
export class P2pCreateComponent implements OnInit {

  form: FormGroup;

  get value(): P2PModel {
    return this.form.value;
  }

  constructor(protected p2pService: P2pService) { }

  ngOnInit() {
    let initial = {
      title: new FormControl(),
      text: new FormControl(),
      fosId: new FormControl(),
      blobs: new FormArray([])
    };
    this.form = new FormGroup(initial);
    this.newFile();
  }

  blobs(): _BlobModel[] {
    let control = <FormArray>this.form.controls["blobs"];
    return control.getRawValue();
  }

  newFile() {
    let control = <FormArray>this.form.controls["blobs"];
    control.push(new FormControl());
  }

  fileRemoved(index: number) {
    let control = <FormArray>this.form.controls["blobs"];
    control.removeAt(index);
  }

  submit() {
    //this.p2pService.create(this.value).subscribe(response => {
    //  console.log(response);
    //});
    console.log(this.value);
  }

}