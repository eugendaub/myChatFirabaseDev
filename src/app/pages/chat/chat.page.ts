import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatId = null;
  currentUserId = null;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('chatid');
    this.currentUserId = this.authService.getUserId();

    console.log('My Chat: ', this.chatId);
  }

}
