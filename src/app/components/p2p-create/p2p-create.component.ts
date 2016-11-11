import { Component, OnInit } from '@angular/core';
import { P2PModel } from '../../models/dto';
import { FormGroup, FormControl } from '@angular/forms';
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
    console.log("init");
    let initial = {
      title: new FormControl(),
      text: new FormControl(),
      fos: new FormControl()
    };
    this.form = new FormGroup(initial);
  }

  submit() {
    this.p2pService.create(this.value).subscribe(response => {
      console.log(response);
    });
  }

}
