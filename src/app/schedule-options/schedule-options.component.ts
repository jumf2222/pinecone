import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-schedule-options",
  templateUrl: "./schedule-options.component.html",
  styleUrls: ["./schedule-options.component.scss"]
})
export class ScheduleOptionsComponent implements OnInit {
  notices = true;

  constructor() { }

  ngOnInit(): void {
  }

}
