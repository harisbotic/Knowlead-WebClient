import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { RealtimeService } from './services/realtime.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService, realtimeService: RealtimeService) {
    translate.addLangs(["en"]);
    translate.setDefaultLang("en");
    translate.use("en");
  }
}
