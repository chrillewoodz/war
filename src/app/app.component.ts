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

      const cachedId = this.cache.clientId;
      const clientId = cachedId || this.socket.ioSocket.id;

      if (!cachedId) {
        this.cache.setClientId(clientId);
      }

      if (clientId) {
        console.log(`%c ClientID: ${clientId}`, 'color: green');
        clearInterval(interval);
      }
    }, 100);
  }
}
