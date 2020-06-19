import { Injectable } from '@angular/core';
import { Course, Section, Schedule } from './definitions';
import { Subject } from 'rxjs';
import { Session } from './definitions'

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  courses: Array<Course> = [];
  coursesSubject = new Subject<Array<Course>>();
  settings = { allowFull: true, scheduleCount: 10 };
  constructor() {
  }

  selectCourse(course: Course): void {
    for (let c of this.courses) {
      if (c.code === course.code) {
        return;
      }
    }
    this.courses.push(course);
    this.coursesSubject.next(this.courses);
  }

  removeCourse(course: Course): void {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i].code === course.code) {
        this.courses.splice(i, 1);
        this.coursesSubject.next(this.courses);
        break;
      }
    }
  }

  isConflicting(schedule: Schedule, new_sect: Section): boolean {
    for (const new_sess of new_sect.sessions) {
      let day = schedule.times.get(new_sess.day);
      if (day === undefined) continue;

      for (let i = new_sess.start; i < new_sess.end; i++) {
        if (day[i]) return true;
      }
    }
    return false;
  }

  addSection(schedule: Schedule, new_sect: Section): void {
    schedule.sections.push(new_sect);
    for (const new_sess of new_sect.sessions) {
      if (!schedule.times.has(new_sess.day)) schedule.times.set(new_sess.day, []);

      let day = schedule.times.get(new_sess.day);
      for (let i = new_sess.start; i < new_sess.end; i++) {
        day[i] = true;
      }
    }
  }

  removeSection(schedule: Schedule, new_sect: Section): void {
    schedule.sections.pop();
    for (const new_sess of new_sect.sessions) {
      let day = schedule.times.get(new_sess.day);
      for (let i = new_sess.start; i < new_sess.end; i++) {
        day[i] = undefined;
      }
    }
  }

  scoreSchedule(schedule: Schedule): void {
    let total = 0;
    for (const day of schedule.times) {
      let begin = undefined;
      let end = undefined;
      let dayTotal = 0;
      for (let i = 0; i < 48; i++) {
        if (day[1][i]) {
          if (begin === undefined) begin = i;
          end = i;
          dayTotal++;
        }
      }
      if (begin !== undefined && end !== undefined)
        total -= end - begin - dayTotal + 1;
    }

    schedule.score = total;
  }

  copySchedule(schedule: Schedule): Schedule {
    let temp = new Map();
    for (const data of schedule.times) temp.set(data[0], [...data[1]]);
    return { sections: [...schedule.sections], times: temp, score: schedule.score };
  }

  addCourse(schedule: Schedule, output: Array<Schedule>, index: number = 0, type: number = 0): void {

    if (type > 2) {
      this.scoreSchedule(schedule);

      for (let i = 0; i < output.length; i++) {
        if (output[i].score < schedule.score) {
          output.splice(i, 0, this.copySchedule(schedule));
          if (output.length > this.settings.scheduleCount) output.pop();
          return;
        }
      }

      if (output.length < this.settings.scheduleCount) output.push(this.copySchedule(schedule));
      return;
    }

    if (index >= this.courses.length) {
      this.addCourse(schedule, output, 0, type + 1);
      return;
    }

    let data = this.courses[index].lecs;
    if (type === 1) data = this.courses[index].tuts;
    else if (type === 2) data = this.courses[index].pras;

    if (data.length === 0) {
      this.addCourse(schedule, output, index + 1, type);
      return;
    }

    for (let lec of data) {
      if (lec.sessions.length === 0) continue;
      if (!this.settings.allowFull && lec.curEnroll >= lec.maxEnroll) continue;

      if (!this.isConflicting(schedule, lec)) {
        this.addSection(schedule, lec);
        this.addCourse(schedule, output, index + 1, type);
        this.removeSection(schedule, lec);
      } else {
        // console.log("conflict", { ...schedule }, lec);
      }
    }
  }

  createSchedule(): void {
    let schedule: Schedule = { sections: [], times: new Map(), score: 0 };
    let output = [];
    this.addCourse(schedule, output);
    if (output.length === 0) {
      console.log("No Possible Schedules!");
    } else {
      console.log("New schedules:", output);
    }
  }
}
