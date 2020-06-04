import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses: Array<Course>;
  constructor(public courseService: CourseService) { }

  ngOnInit(): void {
    this.courseService.search("").then(data => this.courses = data);
  }

  search(value) {
    this.courseService.search(value.toUpperCase()).then(data => {
      this.courses = data
      console.log(this.courses)
    });
  }
}