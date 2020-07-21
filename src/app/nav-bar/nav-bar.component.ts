import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent implements OnInit {
  sideMenu = false;
  selectedTab = 0;

  links = [
    { name: "Dashboard", route: "/" },
    { name: "Course Finder", route: "/finder" },
    { name: "Timetable", route: "/planner" },
    { name: "Settings", route: "/preferences" }
  ];
  constructor(public router: Router, public authService: AuthService, public mediaMatcher: MediaMatcher) { }

  ngOnInit(): void {
  }

}
