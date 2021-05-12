import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private databaseFirebase = '/messages';
  messageReference: AngularFirestoreCollection<Message>;
  constructor(private firestore: AngularFirestore) { 
    this.messageReference = firestore.collection(this.databaseFirebase)
  }

  

  sendMessage(message: Message) {

    /*const messageObj = {
      from: message.from,
      to: message.to,
      messageText: message.messageText,
      translatedMessage: message.translatedMessage,
      viewed: message.viewed
    };*/
    return this.messageReference.add(message);
  }

  getMessages(): Observable<any> {
    return this.messageReference.snapshotChanges();
  }
}
