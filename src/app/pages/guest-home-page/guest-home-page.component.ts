import { Component } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-guest-home-page',
  templateUrl: './guest-home-page.component.html',
  styleUrls: ['./guest-home-page.component.scss']
})
export class GuestHomePageComponent {

  constructor(protected realtimeService: RealtimeService) { }

  pritisno() {
    this.realtimeService.send();
  }

}
