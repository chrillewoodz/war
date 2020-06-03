import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, tap, delay } from 'rxjs/operators';

import {
  GameCache,
  MatchMaker,
  ModalApi
} from 'shared';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public idCtrl = new FormControl('', [Validators.required]);
  public hostError = new Subject();
  public joinError = new Subject();
  public joinByIdError = new Subject();
  public hostError$ = this.hostError.asObservable();
  public joinError$ = this.joinError.asObservable();
  public joinByIdError$ = this.joinByIdError.asObservable();

  public settings = this.fb.group({
    private: [false],
    maxPlayers: [4, [Validators.required, Validators.min(2), Validators.max(4)]]
  });

  public stats$ = this.socket.fromEvent('stats');

  constructor(
    private cache: GameCache,
    private fb: FormBuilder,
    private matchmaker: MatchMaker,
    private modalApi: ModalApi,
    private router: Router,
    private socket: Socket
  ) {
    this.socket.emit('stats');
  }

  ngOnInit(): void {

  }

  join(id?: string) {

    if (id) {

      if (this.idCtrl.invalid) {
        return;
      }
    }

    this.matchmaker.join(id).pipe(
      first()
    ).subscribe((e) => {
      console.log('join', e);
      this.router.navigateByUrl('session');
    }, (e) => {

      if (id) {
        this.joinByIdError.next(e);
      }
      else {
        this.joinError.next(e);
      }
    });
  }

  host() {

    if (this.settings.valid) {

      this.matchmaker.host(this.settings.value).pipe(
        first()
      ).subscribe((e) => {
        console.log(e);
        this.modalApi.close('host-settings');
        this.router.navigateByUrl('session');
      }, (e) => {
        this.hostError.next(e);
      });
    }
  }

  openHostSettings() {
    this.modalApi.open('host-settings');
  }
}
