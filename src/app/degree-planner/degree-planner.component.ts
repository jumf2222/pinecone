import { Component, OnInit } from "@angular/core";
// import { DegreeService } from "../degree.service";
import { Router } from "@angular/router";
import { Course, Schedule } from "../definitions";

@Component({
  selector: "app-degree-planner",
  templateUrl: "./degree-planner.component.html",
  styleUrls: ["./degree-planner.component.scss"]
})
export class DegreePlannerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // formatCourses(courses: Course[]): Course[] {
  //   let newCourses = [...courses];
  //   while (newCourses.length < 6) newCourses.push(null);
  //   return newCourses;
  // }

  // selectSchedule(schedule: Schedule) {
  //   this.router.navigate(["schedule"], { queryParams:
  // { schedule: schedule.name, level: this.degreeService.getDegree().years.
  // find(a => Object.values(a.schedules).includes(schedule)).level } });
  // }

}
