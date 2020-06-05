import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';
import { TimetableService } from '../timetable.service';
import { Datasource } from 'ngx-ui-scroll';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses: Array<Course>;
  constructor(public timetableService: TimetableService) { }

  ngOnInit(): void {
  }

  formatCode(code: string) {
    return code.substring(0, 3) + " " + code.substring(3, code.length - 1) + " " + code.substring(code.length - 1);
  }
}