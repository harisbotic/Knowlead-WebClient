import { Component, OnInit } from '@angular/core';
import { P2PModel, ApplicationUserModel, P2PMessageModel, ResponseModel, Guid } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ModelUtilsService } from '../../services/model-utils.service';
import * as _ from 'lodash';
import { dateValidator } from '../../validators/date.validator';

interface threadModel {
  with: ApplicationUserModel;
  messages: P2PMessageModel[];
};

@Component({
  selector: 'app-p2p-discussion',
  templateUrl: './p2p-discussion.component.html',
  styleUrls: ['./p2p-discussion.component.scss'],
  providers: [P2pService, AccountService, ModelUtilsService]
})
export class P2pDiscussionComponent implements OnInit {

  p2p: P2PModel;
  user: ApplicationUserModel;
  forms: {[toId: string]: FormGroup} = {};
  threads: threadModel[] = [];
  scheduleForm: FormGroup;
  scheduleOpened: boolean = false;
  scheduleWith: ApplicationUserModel;

  constructor(
    protected p2pService: P2pService,
    protected route: ActivatedRoute,
    protected accountService: AccountService,
    protected notificationService: NotificationService,
    protected modelUtilsService: ModelUtilsService) {
  }

  private otherUser(message: P2PMessageModel): ApplicationUserModel { 
    if (this.user == null)
      return null;
    if (message.messageFrom.id == this.user.id)
      return message.messageTo;
    else
      return message.messageFrom;
  }

  ngOnInit() {
    interface userAndP2p {
      p2p: P2PModel,
      user: ApplicationUserModel,
      messages: P2PMessageModel[]
    };
    this.fullName = this.modelUtilsService.getUserFullName;
    this.route.params.subscribe(params => {
      let id = params["id"];
      this.p2pService.get(id)
        .combineLatest(this.accountService.currentUser(), this.p2pService.getMessages(id), (p2p, user, messages) =>
          <userAndP2p>{
            p2p: p2p,
            user: user,
            messages: messages
          }
        ).subscribe((value) => {
          if (value.p2p && value.user && value.messages) {
            this.user = value.user;
            this.p2p = value.p2p;
            this.p2p.p2pMessageModels = value.messages;
            this.modelUtilsService.fillP2pMessages(this.p2p.p2pMessageModels).subscribe(values => {
              this.p2p.p2pMessageModels = values;
              values.forEach(msg => {
                let other = this.otherUser(msg);
                this.forms[other.id] = new FormGroup({
                  text: new FormControl("", Validators.required),
                  messageFromId: new FormControl(this.user.id),
                  messageToId: new FormControl(other.id),
                  p2pId: new FormControl(this.p2p.p2pId),
                });
                this.threads = this.getThreads();
              })
            });
        }}, (err: ResponseModel) => {
          this.notificationService.error("p2p|error fetching details", (err && err.errors) ? err.errors[0] : undefined);
        });
    });
    this.scheduleForm = new FormGroup({
      scheduleWithId: new FormControl("", Validators.required),
      scheduleTime: new FormControl(new Date(), dateValidator({minDate: new Date()}))
    });
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
    _.values(ret).forEach((message) => {
      message.messages = _.sortBy(message.messages, "timestamp");
    });
    return _.values(ret);
  }

  submit(id: string) {
    let form = this.forms[id];
    if (form && form.valid) {
      this.p2pService.message(form.value).subscribe(val => {
        this.modelUtilsService.fillP2pMessage(val).subscribe(newVal => {
          this.p2p.p2pMessageModels.push(newVal);
          this.threads = this.getThreads();
        });
      }, (err: ResponseModel) => {
        this.notificationService.error("p2p|error messaging p2p", err && err.errors ? err.errors[0] : undefined);
      });
      this.forms[id].patchValue({text: ""});
    }
  }

  fullName: (user: ApplicationUserModel) => string;

  trackByThread(thread: threadModel) {
    return thread.with.id;
  }

  scheduleNow() {
    this.scheduleForm.patchValue({scheduleTime: null});
    this.schedule();
  }

  schedule() {
    console.log(this.scheduleForm.value);
    console.log(this.scheduleForm.valid);
    if (!this.scheduleForm.valid)
      return;
  }

}
