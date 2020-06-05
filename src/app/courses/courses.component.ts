import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';
import { TimetableService } from '../timetable.service';
import { IDatasource, Datasource } from 'ngx-ui-scroll';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses: Array<Course> = this.courseService.search("");
  datasource = new Datasource({
    get: (index, count, success) => {
      // const data = [];
      // for (let i = index; i <= index + count - 1; i++) {
      //   data.push(courses[i]);
      // }
      console.log(this.courses.slice(index, index + count));
      success(this.courses.slice(index, index + count));
    },
    settings: {
      itemSize: 200,
      minIndex: 0,
      maxIndex: this.courses.length,
      startIndex: 0,
    }
  });

  constructor(public courseService: CourseService, public timetableService: TimetableService) { }

  ngOnInit(): void {
  }

  toggleOpened(item) {
    item.opened = !item.opened;
    this.datasource.adapter.check();
  }


  search(value) {
    this.courses = this.courseService.search(value.toUpperCase());
    this.datasource.settings.maxIndex = this.courses.length;
    this.datasource.adapter.reload();
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
