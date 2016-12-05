import { Component, OnInit } from '@angular/core';
import { P2PModel, ApplicationUserModel, P2PMessageModel, ResponseModel } from '../../models/dto';
import { P2pService } from '../../services/p2p.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-p2p-discussion',
  templateUrl: './p2p-discussion.component.html',
  styleUrls: ['./p2p-discussion.component.scss'],
  providers: [P2pService, AccountService, ModelUtilsService]
})
export class P2pDiscussionComponent implements OnInit {

  p2p: P2PModel;
  user: ApplicationUserModel;
  form: FormGroup;

  constructor(
    protected p2pService: P2pService,
    protected route: ActivatedRoute,
    protected accountService: AccountService,
    protected notificationService: NotificationService,
    protected modelUtilsService: ModelUtilsService) {
  }

  ngOnInit() {
    interface userAndP2p {
      p2p: P2PModel,
      user: ApplicationUserModel,
      messages: P2PMessageModel[]
    };
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
            this.form = new FormGroup({
              text: new FormControl("", Validators.required),
              messageFromId: new FormControl(this.user.id),
              messageToId: new FormControl(this.p2p.createdById),
              p2pId: new FormControl(this.p2p.p2pId),
            });
            this.modelUtilsService.fillP2pMessages(this.p2p.p2pMessageModels).subscribe(values => {
              this.p2p.p2pMessageModels = values;
            });
        }}, (err: ResponseModel) => {
          this.notificationService.error("p2p:error fetching details", (err && err.errors) ? err.errors[0] : undefined);
        });

    })
  }

  submit() {
    if (this.form && this.form.valid) {
      this.p2pService.message(this.form.value).subscribe(val => {
        this.modelUtilsService.fillP2pMessage(val).subscribe(newVal => {
          this.p2p.p2pMessageModels.push(newVal);
        });
      }, (err: ResponseModel) => {
        this.notificationService.error("p2p:error messaging p2p", err.errors[0]);
      })
    }
  }

}
