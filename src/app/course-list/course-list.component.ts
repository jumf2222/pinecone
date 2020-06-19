import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';
import { TimetableService } from '../timetable.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses: Array<Course>;
  notices = false;
  constructor(public timetableService: TimetableService) { }

  ngOnInit(): void {


  }

  formatCode(code: string) {
    return code.substring(0, 3) + " " + code.substring(3, code.length - 1) + " " + code.substring(code.length - 1);
  }
  getCode(code: string, index: number) {
    return this.formatCode(code).split(" ")[index];
  }

  scroll(id, event) {
    console.log(`scrolling to ${id}`);
    event.stopPropagation();
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: 'smooth' });
  }

}