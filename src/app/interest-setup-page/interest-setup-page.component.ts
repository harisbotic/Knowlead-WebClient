import { Component, OnInit } from '@angular/core';
import { StorageService } from './../storage.service';
import { FOSModel, InterestModel } from './../models/dto';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss']
})
export class InterestSetupPageComponent implements OnInit {

  category: FOSModel;
  root: FOSModel;

  constructor(protected storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getFOShierarchy().subscribe(root => {
      this.category = root.children[2];
      console.log(this.category);
    });
  }

}
