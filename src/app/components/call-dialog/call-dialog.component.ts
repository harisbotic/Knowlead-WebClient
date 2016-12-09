import { Component, OnInit } from '@angular/core';
import { ApplicationUserModel, CallModel, P2pCallModel, P2PModel } from '../../models/dto';
import { AccountService } from '../../services/account.service';
import { BaseComponent } from '../../base.component';
import { RealtimeService } from '../../services/realtime.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import { P2pService } from '../../services/p2p.service';

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss']
})
export class CallDialogComponent extends BaseComponent implements OnInit {

  user: ApplicationUserModel;
  call: CallModel | P2pCallModel;
  p2p: P2PModel;

  constructor(
    protected accountService: AccountService,
    protected realtimeService: RealtimeService,
    protected p2pService: P2pService) { super() }

  ngOnInit() {
    this.subscriptions.push(this.accountService.currentUser().subscribe((user) => {
      this.user = user;
    }));
    this.subscriptions.push(this.realtimeService.callSubject.subscribe((call) => {
      this.call = call;
      delete this.p2p;
      if (ModelUtilsService.isCallP2p(this.call)) {
        this.subscriptions.push(this.p2pService.get(this.call.p2pId).subscribe(p2p => {
          this.p2p = p2p;
        }));
      }
    }))
  }

  fullName = ModelUtilsService.getUserFullName;

  otherUser(): ApplicationUserModel {
    if (!this.user || !this.call)
      return null;
    return this.user.id == this.call.caller.id ? this.call.caller : this.call.receiver;
  }

  isCaller(): boolean {
    if (!this.user || !this.call)
      return null;
    return this.call.caller.id == this.user.id;
  }

  callPrefix(): string {
    if (!this.user || !this.call)
      return null;
    if (this.isCaller())
      return "call|sending call";
    else
      return "call|receiving call";
  }

  cleanup() {
    delete this.call;
    delete this.p2p;
  }

  decline() {
    this.cleanup();
  }

  accept() {
    this.cleanup();
  }

}
