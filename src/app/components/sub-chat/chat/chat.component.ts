import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { ApplicationUserModel } from '../../../models/dto';
import { ModelUtilsService } from '../../../services/model-utils.service';
import * as _ from 'lodash';
import { ChatConverisationComponent } from '../chat-converisation/chat-converisation.component';
import { SessionService } from '../../../services/session.service';
import { NotificationService } from '../../../services/notifications/notification.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent implements OnInit {

  friends: ApplicationUserModel[] = [];
  allFriends: ApplicationUserModel[] = [];
  converisations: ComponentRef<ChatConverisationComponent>[] = [];
  friendsOpened = false;
  shouldShow = false;
  @ViewChild('tabs', {read: ViewContainerRef}) tabs: ViewContainerRef;

  constructor(protected chatService: ChatService,
              protected modelUtilsService: ModelUtilsService,
              protected componentFactoryResolver: ComponentFactoryResolver,
              protected notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.chatService.getAcceptedFriendsIds()
      .flatMap(ids => this.modelUtilsService.fillUsersById(ids))
      .subscribe(friends => {
        this.allFriends = friends;
      }));
    this.subscriptions.push(this.notificationService.showHeaderSubject.subscribe(val => {
      this.shouldShow = val;
    }));
  }

  searchUpdate(newSearch: string) {
    if (!!!newSearch) {
      this.friends = this.allFriends;
    } else {
      this.friends = this.allFriends.filter(user => {
        if (!!!user.name || !!!user.surname) {
          return user.email.includes(newSearch);
        } else {
          return user.name.toLowerCase().includes(newSearch) || user.surname.toLowerCase().includes(newSearch);
        }
      });
    }
  }

  private getConverisationIndex(other: ApplicationUserModel): number {
    return _.findIndex(this.converisations, conv => conv.instance.user.id === other.id);
  }

  openConverisation(other: ApplicationUserModel) {
    if (this.getConverisationIndex(other) !== -1) {
      return;
    }
    let factory = this.componentFactoryResolver.resolveComponentFactory(ChatConverisationComponent);
    let componentRef = this.tabs.createComponent(factory, 0);
    componentRef.instance.user = other;
    componentRef.instance.close.take(1).subscribe(() => {
      this.closeConverisation(other);
    });
    this.converisations.push(componentRef);
  }

  closeConverisation(other: ApplicationUserModel) {
    let idx = this.getConverisationIndex(other);
    if (idx !== -1) {
      let viewIdx = this.tabs.indexOf(this.converisations[idx].hostView);
      this.tabs.remove(viewIdx);
      this.converisations.splice(idx);
    }
  }

  toggleFriends() {
    this.friendsOpened = !this.friendsOpened;
    this.searchUpdate('');
  }

}
