import { Component, OnInit } from "@angular/core";
import { Schedule } from '../definitions';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})

export class HomeComponent implements OnInit {

  schedules: Schedule[] = [];
  displayedColumns = ['name', 'year', 'term'];

  constructor() { }

  ngOnInit(): void {
  }

}
