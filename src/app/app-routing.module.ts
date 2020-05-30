import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyModule) },
  { path: 'session', loadChildren: () => import('./session/session.module').then(m => m.SessionModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
