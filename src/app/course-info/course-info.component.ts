import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Course } from "../definitions";

@Component({
  selector: "app-course-info",
  templateUrl: "./course-info.component.html",
  styleUrls: ["./course-info.component.scss"]
})
export class CourseInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public course: Course) { }

  ngOnInit(): void {
  }

}
