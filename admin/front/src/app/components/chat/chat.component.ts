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
  users: any[] = [];
  messageObject: any;
  userSellerId: any = {};
  public userSelect: any = null;
  public from;



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
    this.messages = [];

    this.messageService.getMessagesFilter(to, this.from).subscribe(data => {
      //console.log(this.userSellerId);
      for (const i in data) {
        this.messages.push(data[i]);
      }
    });

    this.messageService.getMessagesFilterUserBuyer(to, this.from).subscribe(data => {
      for (const i in data) {
        this.messages.push(data[i]);
        console.log(this.messages)
      }
    });

    this.userService.getUser(to).subscribe(data => {
      this.userSelect = JSON.parse(JSON.stringify(data[0]));
      this.userSelect.id = JSON.parse(JSON.stringify(data[0].id));
      console.log(this.userSelect.id);
    });

    this.scrollToBottom();
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
    this.scrollToBottom();
  }


  saveMessage(sendMessage) {
    let date = Date.now();
    if (sendMessage.valid) {
      this.message = {
        from: this.userSellerId,
        to: this.userSelect.id,
        messageText: this.message.messageText,
        translatedMessage: '',
        viewed: false,
        createAt: this.miDatePipe.transform(date, 'MMM d, y, h:mm:ss a')
      };
    }

    this.messageService.sendMessage(this.message);

    /*this.messageService.translateText(this.message.messageText, this.userSelect.languageCode).subscribe(
      res => {
        this.message.translatedMessage = JSON.parse(JSON.stringify(res[0].translations[0].text));
        console.log(this.message.translatedMessage);
        this.messageService.sendMessage(this.message);
        console.log('Se ha ingresado satisfactoriamente el mensaje');
      })*/

    this.scrollToBottom();
    this.message.messageText = "";
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
