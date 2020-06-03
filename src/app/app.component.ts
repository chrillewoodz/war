import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameCache } from 'shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(private cache: GameCache, private socket: Socket) {

    const interval = setInterval(() => {

      const clientId = this.socket.ioSocket.id;

      if (this.socket.ioSocket.id) {
        console.log(`%c ClientID: ${clientId}`, 'color: green');
        clearInterval(interval);
        this.cache.setClientId(clientId);
      }
    }, 100);
  }
}
