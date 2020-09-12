import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  GameCache,
  ModalApi,
  SocketApi,
  SessionSettings
} from 'shared';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent {

  public idCtrl = new FormControl('', [Validators.required]);
  public hostError = new Subject();
  public joinError = new Subject();
  public joinByIdError = new Subject();
  public hostError$ = this.hostError.asObservable();
  public joinError$ = this.joinError.asObservable();
  public joinByIdError$ = this.joinByIdError.asObservable();

  public settings = this.fb.group({
    private: [false],
    minPlayers: [2, [Validators.required, Validators.min(2), Validators.max(4)]],
    maxPlayers: [4, [Validators.required, Validators.min(2), Validators.max(4)]]
  });

  public stats$ = this.socketApi.stats(true);

  constructor(
    private cache: GameCache,
    private fb: FormBuilder,
    private modalApi: ModalApi,
    private router: Router,
    private socketApi: SocketApi
  ) {
    this.cache.removeSessionId();
    this.cache.removeSession();
  }

  tutorial() {
    this.router.navigate(['tutorial']);
  }

  join(sessionId?: string) {

    if (sessionId) {

      if (this.idCtrl.invalid) {
        return;
      }
    }

    this.socketApi.join(true, null, sessionId)
      .pipe(
        first()
      ).subscribe((e) => {
        this.router.navigate(['session', e.session.sessionId]);
      }, (e) => {

        if (sessionId) {
          this.joinByIdError.next(e);
        }
        else {
          this.joinError.next(e);
        }
      }
    );
  }

  host() {

    if (this.settings.valid) {

      this.socketApi.host(true, null, this.settings.value as SessionSettings)
        .pipe(
          first()
        )
        .subscribe((e) => {
          this.modalApi.close('host-settings');
          this.router.navigate(['session', e.session.sessionId]);
        }, (e) => {
          this.hostError.next(e);
        }
      );
    }
  }

  openHostSettings() {
    this.modalApi.open('host-settings');
  }
}
