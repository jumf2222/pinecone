import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';
import { TimetableService } from '../timetable.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Array<Course>;
  constructor(public courseService: CourseService, public timetableService: TimetableService) { }

  ngOnInit(): void {
    this.courseService.search("").then(data => this.courses = data);
  }

  search(value) {
    this.courseService.search(value.toUpperCase()).then(data => {
      this.courses = data
      console.log(this.courses)
    });
  }

  getCourseCategory(code: string) {
    return code.substring(0, 3);
  }

  getCourseNumber(code: string) {
    return code.substring(3, code.length - 1);
  }

  getCourseAcademicSession(code: string) {
    return code.substring(code.length - 1);
  }
}
