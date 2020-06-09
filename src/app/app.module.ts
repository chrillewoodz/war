import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { GameCache } from 'shared';

const config: SocketIoConfig = {
  url: 'http://localhost:4201',
  options: {}
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SocketIoModule.forRoot(config),

    // App
    AppRoutingModule
  ],
  exports: [],
  providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: (socket: Socket, cache: GameCache) => () => {

          return socket.fromOneTimeEvent('connect')
            .then(() => {

              const cachedId = cache.clientId;
              const clientId = cachedId || socket.ioSocket.clientId;

              if (!cachedId) {
                cache.setClientId(clientId);
              }

              console.log(`%c ClientID: ${clientId}`, 'color: green');
            }
          );
        },
        deps: [Socket, GameCache],
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
