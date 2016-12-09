import { Component, OnInit } from '@angular/core';
import { P2PModel, ApplicationUserModel, P2PMessageModel, ResponseModel, Guid, P2PScheduleModel } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import * as _ from 'lodash';
import { dateValidator } from '../../validators/date.validator';
import { BaseComponent } from '../../base.component';
import { tomorrow } from '../../utils/index';

interface threadModel {
  with: ApplicationUserModel;
  messages: P2PMessageModel[];
};

@Component({
  selector: 'app-p2p-discussion',
  templateUrl: './p2p-discussion.component.html',
  styleUrls: ['./p2p-discussion.component.scss']
})
export class P2pDiscussionComponent extends BaseComponent implements OnInit {

  p2p: P2PModel;
  user: ApplicationUserModel;
  forms: {[toId: string]: FormGroup} = {};
  threads: threadModel[] = [];
  scheduleForm: FormGroup;
  scheduleOpened: boolean = false;
  scheduleWith: ApplicationUserModel;
  discussable: boolean = false;
  messages: P2PMessageModel[];

  constructor(
    protected p2pService: P2pService,
    protected route: ActivatedRoute,
    protected accountService: AccountService,
    protected notificationService: NotificationService,
    protected modelUtilsService: ModelUtilsService) {
    super();
  }

  private otherUser(message: P2PMessageModel): ApplicationUserModel { 
    if (this.user == null)
      return null;
    if (message.messageFrom.id == this.user.id)
      return message.messageTo;
    else
      return message.messageFrom;
  }

  private makeFormGroup(fromId: string, toId: string) {
    return new FormGroup({
      text: new FormControl("", Validators.required),
      messageFromId: new FormControl(fromId),
      messageToId: new FormControl(toId),
      p2pId: new FormControl(this.p2p.p2pId),
    });
  }

  ngOnInit() {
    interface userAndP2p {
      p2p: P2PModel,
      user: ApplicationUserModel,
      messages: P2PMessageModel[]
    };
    this.subscriptions.push(this.route.params.subscribe(params => {
      let id = params["id"];
      this.scheduleForm = new FormGroup({
        scheduleWithId: new FormControl("", Validators.required),
        scheduleTime: new FormControl(tomorrow(), dateValidator({minDate: new Date()})),
        p2pId: new FormControl(id)
      });
      this.subscriptions.push(this.p2pService.getMessages(id).do(messages => this.messages = messages)
        .merge(this.accountService.currentUser().do(user => this.user = user))
        .merge(this.p2pService.get(id).do(p2p => this.p2p = p2p))
        .subscribe(() => {
          if (this.messages && this.p2p) {
            this.p2p.p2pMessageModels = this.messages;
            this.discussable = !this.p2p.isDeleted && !this.p2p.scheduledWithId;
            if (this.user) {
              this.threads = this.getThreads();
              this.modelUtilsService.fillP2pMessages(this.p2p.p2pMessageModels).subscribe(values => {
                this.p2p.p2pMessageModels = values;
                values.forEach(msg => {
                  let other = this.otherUser(msg);
                  this.forms[other.id] = this.makeFormGroup(this.user.id, other.id);
                });
                if (this.user.id != this.p2p.createdById && values.length == 0) {
                  this.forms[this.p2p.createdById] = this.makeFormGroup(this.user.id, this.p2p.createdById);
                }
                this.threads = this.getThreads();
              });
            }
          }}, (err: ResponseModel) => {
            this.notificationService.error("p2p|error fetching details", (err && err.errors) ? err.errors[0] : undefined);
          }
        )
      );
    }));
  }

  trySchedule(thread: threadModel) {
    this.scheduleForm.patchValue({scheduleWithId: thread.with.id});
    this.scheduleOpened = true;
    this.scheduleWith = thread.with;
  }

  getThreads() {
    if (this.user == null || this.p2p == null || this.p2p.p2pMessageModels == null)
      return [];
    let ret: {[index: string]: threadModel} = {};
    if (this.p2p.p2pMessageModels.length > 0) {
      this.p2p.p2pMessageModels.forEach(msg => {
        let id = this.otherUser(msg).id;

        if (!ret[id]) {
          ret[id] = {
            with: this.otherUser(msg),
            messages: []
          }
        }
        ret[id].messages.push(msg);
      });
    } else {
      ret[this.p2p.createdById] = {
        with: this.p2p.createdBy,
        messages: []
      };
    }
    _.values(ret).forEach((message) => {
      message.messages = _.sortBy(message.messages, "timestamp");
    });
    return _.values(ret);
  }

  submit(id: string) {
    let form = this.forms[id];
    if (form && form.valid) {
      this.subscriptions.push(this.p2pService.message(form.value).subscribe(val => {
        this.subscriptions.push(this.modelUtilsService.fillP2pMessage(val).subscribe(newVal => {
          this.p2p.p2pMessageModels.push(newVal);
          this.threads = this.getThreads();
        }));
      }, (err: ResponseModel) => {
        this.notificationService.error("p2p|error messaging p2p", err && err.errors ? err.errors[0] : undefined);
      }));
      this.forms[id].patchValue({text: ""});
    }
  }

  fullName = ModelUtilsService.getUserFullName;

  trackByThread(thread: threadModel) {
    return thread.with.id;
  }

  scheduleNow() {
    this.scheduleForm.patchValue({scheduleTime: null});
    this.schedule();
  }

  schedule() {
    console.log(this.scheduleForm.value);
    if (!this.scheduleForm.valid)
      return;
    this.subscriptions.push(this.p2pService.schedule(this.scheduleForm.value).subscribe(() => {
      this.scheduleOpened = false;
    }, (err: ResponseModel) => {
      this.notificationService.error("p2p|error scheduling p2p", err && err.errors ? err.errors[0] : undefined);
    }));
  }

}
