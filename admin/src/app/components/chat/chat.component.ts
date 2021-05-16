import { Message } from 'src/app/models/message';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { registerLocaleData } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: Message = new Message();
  messages: any[] = [];
  messageObject: any;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.messages = data;
    });
  }

  saveMessage(sendMessage) {
    if (sendMessage.valid) {
      this.message = {
        from: 'wABFpsA6GAR1HaYIHXpWJxnMYxA2',
        to: 'Ouavc6l8DZYKXLQYTeBEtSJ0VK73',
        messageText: this.message.messageText,
        translatedMessage: this.message.translatedMessage,
        viewed: 'false'
      };

      this.messageService.translateText(this.message.messageText).subscribe(
        res => {
          this.message.translatedMessage = JSON.parse(JSON.stringify(res[0].translations[0].text));
          console.log(this.message.translatedMessage);
          this.messageService.sendMessage(this.message);
          console.log('Se ha ingresado satisfactoriamente el mensaje');
        })
    }
  }

}
