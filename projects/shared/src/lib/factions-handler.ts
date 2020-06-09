import { Player, Session } from './interfaces';
import { factionsAsArray } from './factions';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FactionsHandler {

  private factions = [...factionsAsArray];

  constructor() {}

  assignFaction(session: Session, player: Player) {
    console.log('assigning!');
    const _session = session;
    const _player = player;

    _player.faction = this.getRandomFaction();
    _session.state.players[_player.clientId] = _player;

    console.log('new session with factions ', _session);
    return _session;
  }

  // TODO: This has to be done on the server
  getRandomFaction() {
    console.log(this.factions, this.factions.length);
    const r = Math.floor(Math.random() * this.factions.length - 1);
    const f = this.factions.splice(r, 1)[0];
    console.log(this.factions, this.factions.length, f);
    return f;
  }

  resetFactions() {
    this.factions = [...factionsAsArray];
  }
}