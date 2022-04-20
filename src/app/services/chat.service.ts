import { Injectable } from '@angular/core';
import {addDoc, arrayUnion, collection, collectionData, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore,
              private auth: AuthService) { }

  getAllUsers(){
    const userId = this.auth.getUserEmail();

    const userRef = collection(this.firestore, 'user');
    return collectionData(userRef,{idField: 'id'}).pipe(
      take(1),
      map( users => users.filter(user => user.id !== userId))
    );
  }
  startChat(user){
    const userID = this.auth.getUserId();
    const userEmail = this.auth.getUserEmail();
    const chatUsers = [
      {id: userID, email: userEmail},
      {id: user.id, email: user.email}
    ];
    return this.addChat(chatUsers, user.email);

  }

  startGroup(name, users: []){
    const userID = this.auth.getUserId();
    const userEmail = this.auth.getUserEmail();
    const cleanedUsers = users.map((usr: any) =>({
        id: usr.id,
        email: usr.email
      }));
    const chatUsers = [
      {id: userID, email: userEmail},
      ...cleanedUsers
    ];

    const chatsRef = collection(this.firestore, 'chats');

    return this.addChat(chatUsers, name);
  }

  private addChat(chatUsers,name){
    const chatsRef = collection(this.firestore, 'chats');
    const chat = {
      user: chatUsers,
      name
    };

    return addDoc(chatsRef, chat).then( res => {
      console.log('created chat: ', res);
      const groupID = res.id;
      const promises = [];

      // In der DB muss für jeden user der DB eintrag angepasst werden
      // (in diesem Fall in welchen Chats befindet sich der User)
      for(const user of chatUsers){
        const userChatsRef = doc(this.firestore, `user/${user.id}`);
        const update = updateDoc(userChatsRef, {
          chats: arrayUnion(groupID)
        });
        promises.push(update);
      }
      return Promise.all(promises);
    });
  }
}
