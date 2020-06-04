import { Injectable } from '@angular/core';
import { Course } from './definitions';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  courses: Array<Course> = [];
  coursesSubject = new Subject<Array<Course>>();
  constructor() { }

  selectCourse(course) {
    for (let c of this.courses) {
      if (c.code === course.code) {
        return;
      }
    }
    this.courses.push(course);
    this.coursesSubject.next(this.courses);
  }

  removeCourse(course) {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].code === course.code) {
        this.courses.splice(i, 1);
        this.coursesSubject.next(this.courses);
        break;
      }
    }
  }
}
