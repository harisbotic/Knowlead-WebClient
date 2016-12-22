import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ApplicationUserModel } from '../../models/dto';
import { ModelUtilsService } from '../../services/model-utils.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(protected chatService: ChatService, protected modelUtilsService: ModelUtilsService) { }

  friends: ApplicationUserModel[] = [];

  ngOnInit() {
    this.chatService.getAcceptedFriendsIds()
      .flatMap(ids => this.modelUtilsService.fillUsersById(ids))
      .subscribe(friends => {
        console.log(friends);
        this.friends = friends;
      });
  }

  fullName = ModelUtilsService.getUserFullName;

}
