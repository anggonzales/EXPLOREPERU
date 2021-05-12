import { Message } from 'src/app/models/message';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: Message = new Message();
  messages: any[] = [];
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().subscribe((data: any[]) => {
      data.forEach((element: any) => {
        this.messages.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
    });
  }

  saveMessage(sendMessage) {
    if (sendMessage.valid) {
      this.message = {
        from: 'wABFpsA6GAR1HaYIHXpWJxnMYxA2',
        to: 'Ouavc6l8DZYKXLQYTeBEtSJ0VK73',
        messageText: this.message.messageText,
        translatedMessage: this.message.messageText,
        viewed: 'false'
      };

      this.messageService.sendMessage(this.message);
      console.log('Se ha ingresado satisfactoriamente el mensaje');
    }
  }

}
