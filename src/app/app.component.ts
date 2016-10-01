import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(["en"]);
    translate.setDefaultLang("en");
    translate.use("en");
  }
}
