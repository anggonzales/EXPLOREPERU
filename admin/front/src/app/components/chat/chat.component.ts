import { Message } from 'src/app/models/message';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  message: Message = new Message();
  messages: any[] = [];
  messagesSort: any[] = [];
  users: any[] = [];
  messageObject: any;
  userSellerId: any = {};
  userSelect: any = null;
  from;
  sortedMessages: any = [];



  constructor(private messageService: MessageService,
    private userService: UserService,
    private miDatePipe: DatePipe) {

    this.userSellerId = this.userService.getIdentity();
    this.from = this.userService.getIdentity();
  }

  ngOnInit(): void {
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
    this.messageService.getMessagesFilter(to, this.from).subscribe(data => {
      this.messages = [];
      this.messages = data;

      this.messageService.getMessagesFilterUserBuyer(to, this.from).subscribe(data => {
        for (const i in data) {
          this.messages.push(data[i]);
        }

        this.messages.sort(function (x, y) {
          let a = <any>new Date(x.createAt);
          let b = <any>new Date(y.createAt);
          return a - b;
        });
        
      });
    });

    this.userService.getUser(to).subscribe(data => {
      this.userSelect = JSON.parse(JSON.stringify(data[0]));
      this.userSelect.id = JSON.parse(JSON.stringify(data[0].id));
      this.userSelect.userImage = JSON.parse(JSON.stringify(data[0].userImage));
    });

    this.scrollToBottom();
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
        this.messageService.sendMessage(this.message);
        console.log('Se ha ingresado satisfactoriamente el mensaje');
        this.message.messageText = "";
      });

    this.scrollToBottom();

  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
