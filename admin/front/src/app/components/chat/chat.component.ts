import { Message } from 'src/app/models/message';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [DatePipe]
})
export class ChatComponent implements OnInit {

  message: Message = new Message();
  messages: any[] = [];
  users: any[] = [];
  messageObject: any;
  userSellerId: any = {};
  userSelect: any = null;
  from;



  constructor(private messageService: MessageService, private userService: UserService, private miDatePipe: DatePipe, private router: Router) {
    this.userSellerId = this.userService.getIdentity();
    this.from = this.userSellerId.id;

  }

  ngOnInit(): void {
    //this.getMessages();
    this.getUsersBuyer();

  }

  getUsersBuyer() {
    this.userService.getUsers().pipe(
      map(changes => changes.map(c => ({
        id: c.payload.doc.id,
        ...c.payload.doc.data()
      })))
    ).subscribe(data => {
      this.users = data;
    });
  }

  listMessageUser(to) {
    this.messageService.getMessagesFilter(this.userSellerId, to).subscribe(data => {
      //console.log(this.userSellerId);
      this.messages = [];
      for (const i in data) {
        this.messages.push(data[i]);
      }
    });

    this.userService.getUser(to).subscribe(data => {
      this.userSelect =  JSON.parse(JSON.stringify(data[0]));
      //console.log(this.userSelect);
    });
  }

  getMessages() {
    this.messageService.getMessages().pipe(
      map(changes =>
        changes.map(c =>
        ({
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        })
        )
      )
    ).subscribe(data => {
      this.messages = data;
    });
  }


  saveMessage(sendMessage) {
    let date = Date.now();
    if (sendMessage.valid) {
      this.message = {
        from: this.userSellerId,
        to: this.userSelect.id,
        messageText: this.message.messageText,
        translatedMessage: this.message.translatedMessage,
        viewed: false,
        createAt: this.miDatePipe.transform(date, 'MMM d, y, h:mm:ss a')
      };
    }

    this.messageService.translateText(this.message.messageText, this.userSelect.languageCode).subscribe(
      res => {
        this.message.translatedMessage = JSON.parse(JSON.stringify(res[0].translations[0].text));
        console.log(this.message.translatedMessage);
        this.messageService.sendMessage(this.message);
        console.log('Se ha ingresado satisfactoriamente el mensaje');
      })
  }
}
