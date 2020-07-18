import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  sideMenu: boolean = false;
  selectedTab: number = 0;

  links = [{ name: "Home", route: "/" }, { name: "Finder", route: "/finder" }, { name: "Planner", route: "/planner" }, { name: "Preferences", route: "/preferences" }];
  constructor(public router: Router, public authService: AuthService, public mediaMatcher: MediaMatcher) { }

  ngOnInit(): void {
  }

}
