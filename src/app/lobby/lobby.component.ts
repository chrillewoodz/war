import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  public idCtrl = new FormControl('', [Validators.required]);

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  find() {

    console.log(this.idCtrl.invalid, this.idCtrl.value);
    if (this.idCtrl.valid) {
      // TODO: Find
      this.router.navigateByUrl('session');
    }
  }

  quickmatch() {
    // TODO: Join or host
    console.log('Matchmaking...')
  }
}
