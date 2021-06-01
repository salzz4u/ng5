import { Component, OnInit } from '@angular/core';
import { routes } from '../app-routing.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  redirectRegex = new RegExp(/^[a-zA-Z]/);
  routeMap = routes
    .map((route) => route.path)
    .filter((route) => {
      const check = this.redirectRegex.test(route);
      // console.log(check);
      return check;
    });

  constructor() {}

  ngOnInit(): void {}
}
