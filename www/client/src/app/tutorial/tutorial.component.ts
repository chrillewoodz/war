import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/');
  }
}
