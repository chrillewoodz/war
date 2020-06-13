import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  backToLobby() {
    this.router.navigateByUrl('');
  }
}
