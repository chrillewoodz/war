import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./lobby/lobby.module').then(m => m.LobbyModule) },
  { path: 'session', loadChildren: () => import('./session/session.module').then(m => m.SessionModule) },
  { path: 'summary', loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule) },
  { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
  { path: 'tutorial', loadChildren: () => import('./tutorial/tutorial.module').then(m => m.TutorialModule) }
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
