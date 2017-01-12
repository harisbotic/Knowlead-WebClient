import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ApplicationUserModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  friends: ApplicationUserModel[] = [];
  converisations: ApplicationUserModel[] = [];
  fullName = ModelUtilsService.getUserFullName;

  constructor(protected chatService: ChatService, protected modelUtilsService: ModelUtilsService) { }

  ngOnInit() {
    this.chatService.getAcceptedFriendsIds()
      .flatMap(ids => this.modelUtilsService.fillUsersById(ids))
      .subscribe(friends => {
        this.friends = friends;
      });
  }

  private getConverisationIndex(other: ApplicationUserModel): number {
    return _.findIndex(this.converisations, conv => conv.id === other.id);
  }

  openConverisation(other: ApplicationUserModel) {
    if (this.getConverisationIndex(other) !== -1) {
      return;
    }
    this.converisations.push(other);
  }

  closeConverisation(other: ApplicationUserModel) {
    let idx = this.getConverisationIndex(other);
    if (idx !== -1) {
      this.converisations.splice(idx);
    }
  }

}
