import { Component, OnInit } from '@angular/core';
import { StorageService } from './../storage.service';
import { FOSModel } from './../models/dto';

@Component({
  selector: 'app-interest-setup-page',
  templateUrl: './interest-setup-page.component.html',
  styleUrls: ['./interest-setup-page.component.scss']
})
export class InterestSetupPageComponent implements OnInit {

  constructor(protected storageService: StorageService) { }

  ngOnInit() {
    this.storageService.getFOSes().subscribe(foses => {
      console.log(foses);
    });
  }

}
