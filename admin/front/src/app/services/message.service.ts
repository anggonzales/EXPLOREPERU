import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private databaseFirebase = '/messages';
  messageReference: AngularFirestoreCollection<Message>;
  private messages: Observable<Message[]>;

  constructor(private firestore: AngularFirestore, private _http: HttpClient) {
    this.messageReference = firestore.collection(this.databaseFirebase)
  }

  sendMessage(message: Message) {
    return this.messageReference.add(message);
  }

  getMessages(): Observable<any> {
    return this.messageReference.snapshotChanges();
  }

  getMessagesFilter(to, from): Observable<any> {
    this.messageReference = this.firestore.collection('messages', ref => ref
    .where('from', "==", from)
    .where('to', "==", to));
    return this.messages = this.messageReference.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Message;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getMessagesFilterUserBuyer(from, to): Observable<any> {
    this.messageReference = this.firestore.collection('messages', ref => ref
    .where('from', "==", from)
    .where('to', "==", to));
    return this.messages = this.messageReference.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Message;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  public translateText(message, languageCode):Observable<any>{
    const API = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=es&to='+languageCode

    let headers = new HttpHeaders ({
      'Ocp-Apim-Subscription-Key' : '755fc7928e474253920a593a0f53b32e',
      'Ocp-Apim-Subscription-Region' : 'global',
      'Content-Type' : 'application/json',
    });

    return this._http.post(API, [{ 'text' : message }], {headers: headers});
  }
}
