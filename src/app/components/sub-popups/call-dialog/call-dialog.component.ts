import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel, _CallModel, P2PModel } from '../../../models/dto';
import { AccountService } from '../../../services/account.service';
import { BaseComponent } from '../../../base.component';
import { RealtimeService } from '../../../services/realtime.service';
import { ModelUtilsService } from '../../../services/model-utils.service';
import { P2pService } from '../../../services/p2p.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss'],
})
export class CallDialogComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  call: _CallModel;
  p2p: P2PModel;
  fullName = ModelUtilsService.getUserFullName;

  constructor(
    protected accountService: AccountService,
    protected realtimeService: RealtimeService,
    protected p2pService: P2pService,
    protected router: Router) { super(); }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe((user) => {
      this.user = user;
    }));
    this.subscriptions.push(this.realtimeService.callInvitations.subscribe((call) => {
      this.call = call;
      delete this.p2p;
      if (ModelUtilsService.isCallP2p(this.call)) {
        this.subscriptions.push(this.p2pService.get(this.call.p2pId).subscribe(p2p => {
          this.p2p = p2p;
        }));
      }
    }));
    this.subscriptions.push(this.realtimeService.callModelUpdateSubject.subscribe((call) => {
      // Check if this call was a reject or accept
      if (this.call && call) {
        this.redirect();
      }
    }));
  }

  otherUser(): Observable<ApplicationUserModel> {
    if (!this.user || !this.call) {
      return null;
    }
    return this.accountService.getUserById(ModelUtilsService.getOtherCallParties(this.call, this.user.id)[0].peerId);
  }

  isCaller(): boolean {
    if (!this.user || !this.call) {
      return null;
    }
    return this.call.caller.peerId === this.user.id;
  }

  callPrefix(): string {
    if (!this.user || !this.call) {
      return null;
    }
    if (this.isCaller()) {
      return 'call|sending call';
    } else {
      return 'call|receiving call';
    }
  }

  redirect() {
    this.router.navigate(['/call/' + this.call.callId]);
    this.cleanup();
  }

  cleanup() {
    delete this.call;
    delete this.p2p;
  }

  decline() {
    this.realtimeService.respondToCall(this.call.callId, false);
    this.cleanup();
  }

  accept() {
    this.realtimeService.respondToCall(this.call.callId, true);
    this.redirect();
  }

}
