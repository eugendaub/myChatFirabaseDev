import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-start-group-modal',
  templateUrl: './start-group-modal.page.html',
  styleUrls: ['./start-group-modal.page.scss'],
})
export class StartGroupModalPage implements OnInit {
  users = [];
  group = false;
  groupName = '';

  constructor(private chatService: ChatService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.chatService.getAllUsers().subscribe(res=>{
      console.log('user: ', res);
      this.users = res;
    });
  }


  close(){
    this.modalCtrl.dismiss();
  }

  startGroup(){
    console.log('group: ', this.users);
    const selected = this.users.filter(user => user.selected);
    if (selected.length == 0){
      return;
    }
    this.modalCtrl.dismiss({
      action: 'group',
      name: this.groupName,
      users: selected
    });
  }

  startChat(user){
    if(this.group){
      return;
    }
    this.modalCtrl.dismiss({
      action: 'single',
      user: {email: user.email, id: user.id}
    });
  }

}
