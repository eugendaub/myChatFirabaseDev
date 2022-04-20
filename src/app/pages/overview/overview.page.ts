import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {StartGroupModalPage} from '../start-group-modal/start-group-modal.page';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  constructor(private authService: AuthService,
              private modalCtrl: ModalController,
              private routerOutler: IonRouterOutlet,
              private chatService: ChatService) { }

  ngOnInit() {
  }

  async startGroup(){
    const modal = await this.modalCtrl.create({
      component: StartGroupModalPage,
      swipeToClose: true,
      presentingElement: this.routerOutler.nativeEl
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    console.log('AFTER close: ' , data);
    if(data){
      if(data.action == 'single'){
        await this.chatService.startChat(data.user);
      }else if(data.action == 'group'){
        await  this.chatService.startGroup(data.name, data.users);
      }
    }
  }

  logout(){
    this.authService.logout();
  }

}
