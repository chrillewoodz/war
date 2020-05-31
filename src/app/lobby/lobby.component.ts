import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  GameCache,
  MatchMaker
} from 'shared';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public idCtrl = new FormControl('', [Validators.required]);
  public sessionIdError = new Subject();
  public quickmatchError = new Subject();
  public sessionIdError$ = this.sessionIdError.asObservable();
  public quickmatchError$ = this.quickmatchError.asObservable();

  constructor(
    private cache: GameCache,
    private matchmaker: MatchMaker,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  find() {

    if (this.idCtrl.valid) {

      this.matchmaker.joinBySessionId(this.idCtrl.value).pipe(
        first()
      ).subscribe(() => {
        this.cache.setSessionId('9a8sdasd9as8d9a8dasda2sads');
        this.router.navigateByUrl('session');
      }, (e) => {
        this.sessionIdError.next(e);
      });
    }
  }

  quickmatch() {
    // TODO: Join or host

    this.matchmaker.quickmatch().pipe(
      first()
    ).subscribe(() => {
      console.log('hello')
      this.cache.setSessionId('aodaks0a98sdasd9asdasd8sda89');
      this.router.navigateByUrl('session');
    }, (e) => {
      this.quickmatchError.next(e);
    });
  }
}
