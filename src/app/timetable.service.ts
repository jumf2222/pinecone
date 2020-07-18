import { Injectable } from '@angular/core';
import { Course, Section, Schedule, DAY_CODES } from './definitions';
import { Subject, BehaviorSubject } from 'rxjs';
// import { MeetingSession } from './definitions'
import { DegreeService } from './degree.service';
import { Session } from 'protractor';
import { APIService } from './API.service';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  // courses: Course[] = [];
  // sessionSubject = this.degreeService.activeSessionSubject;
  // courses: Course[];
  // coursesSubject = new BehaviorSubject<Course[]>(null);
  scheduleSubject = new BehaviorSubject<Schedule>(null);
  settings = { allowFull: true, scheduleCount: 10 };
  schedule: Schedule;
  scheduleOptions: Schedule[] = [];
  scheduleOptionsInd: number = -1;
  scheduleCount: number = 0;

  constructor(private degreeService: DegreeService, private courseService: CourseService, private apiService: APIService) {
  }

  setSession(schedule: Schedule) {
    // this.schedule.courses = schedule.courses;
    // this.schedule.coursesSubject.next(this.schedule.courses);

    // if (!session)
    //   session.data = { sections: [], times: {}, score: 0, conflicts: [] };

    this.schedule = schedule;
    this.scheduleSubject.next(this.schedule);
  }

  async setScheduleByID(id: string) {
    try {
      this.schedule = await this.apiService.GetSchedule(id);
    } catch (error) {
      this.schedule = {
        id: "100",
        year: "2020",
        term: "F",
        name: "2020 - Fall",
        courses: [],
        sections: [],
        autoLectures: [],
        autoPraticals: [],
        autoTutorials: [],
        score: null
      }
    }
  }

  async selectCourse(course: Course) {
    if (this.schedule.courses.length >= 6) return;

    for (let c of this.schedule.courses) {
      if (c?.code === course.code) {
        return;
      }
    }

    course = await this.courseService.getCourse(course.id);

    this.schedule.courses.push(course);
    // this.schedule.coursesSubject.next(this.schedule.courses);

    let lec = course.lectures[0];
    if (lec) this.addSection(this.schedule, lec);

    let pra = course.praticals[0];
    if (pra) this.addSection(this.schedule, pra);

    let tut = course.tutorials[0];
    if (tut) this.addSection(this.schedule, tut);

    this.scheduleSubject.next(this.schedule);
  }

  removeCourse(course: Course): void {

    for (let i = this.schedule.sections.length - 1; i > -1; i--) {
      const element = this.schedule.sections[i];
      if (element.courseID === course.id)
        this.removeSection(this.schedule, element);
    }

    let ind = this.schedule.courses.findIndex(a => a.code === course.code);
    if (ind === -1) return;

    this.schedule.courses.splice(ind, 1);
    console.log(this.schedule);
    this.scheduleSubject.next(this.schedule);
  }

  removeSection(schedule: Schedule, newSect: Section): void {

    let ind = this.schedule.sections.findIndex(a => a.code === newSect.code);
    console.log("new sect", newSect, ind);
    if (ind === -1) return;

    schedule.sections = schedule.sections.splice(ind, 1);
    for (const newSess of newSect.sessions) {
      console.log("sess", newSess);

      let day = schedule.times[newSess.day];
      for (let i = newSess.start; i < newSess.end; i++) {
        if (!day[i]) continue;

        console.log("index", day[i].findIndex(a => a === newSect));
        day[i].splice(day[i].findIndex(a => a === newSect), 1);
        if (day[i].length === 0) {
          day[i] = undefined;
          // console.log("deleted");
        }
      }
    }
  }

  isConflicting(schedule: Schedule, newSect: Section): boolean {
    for (const newSess of newSect.sessions) {
      let day = schedule.times[newSess.day];
      if (day === undefined) continue;

      for (let i = newSess.start; i < newSess.end; i++) {
        if (day[i]) return true;
      }
    }
    return false;
  }

  addSection(schedule: Schedule, newSect: Section): void {
    schedule.sections.push(newSect);
    for (const newSess of newSect.sessions) {

      if (!schedule.times[newSess.day]) schedule.times[newSess.day] = {};
      let day = schedule.times[newSess.day];

      for (let i = newSess.start; i < newSess.end; i++) {
        if (day[i])
          schedule.conflicts.push(newSect);
        else
          day[i] = [];

        day[i].push(newSect);
      }
    }
  }

  popSection(schedule: Schedule, newSect: Section): void {
    schedule.sections.pop();
    for (const newSess of newSect.sessions) {

      let day = schedule.times[newSess.day];
      for (let i = newSess.start; i < newSess.end; i++) {
        day[i].pop();
        if (day[i].length === 0) {
          day[i] = undefined;
          // console.log("deleted");
        }
      }
    }
  }

  scoreSchedule(schedule: Schedule): void {
    this.scheduleCount++;

    let total = 0;
    for (let day of DAY_CODES) {
      let begin = 100;
      let end = 0;
      let dayTotal = 0;

      if (day in schedule.times) {
        let dayTimes = schedule.times[day];
        for (let timeString in dayTimes) {
          if (dayTimes[timeString]) {
            let time = parseInt(timeString);
            if (time < begin) begin = time;
            if (time > end) end = time;
            dayTotal++;
          }
        }
      }

      if (begin >= end) {
        total += 18;
      } else {
        total -= (end - begin + 1) - dayTotal;
      }
    }

    schedule.score = total;
  }

  copySchedule(schedule: Schedule): Schedule {
    // return JSON.parse(JSON.stringify(schedule));
    // console.log("done", JSON.parse(JSON.stringify(schedule)));

    // return JSON.parse(JSON.stringify(schedule));

    let tempDays = {};

    for (let day in schedule.times) {
      let hasData = false;
      let tempDay = {};

      for (let time in schedule.times[day]) {
        let section = schedule.times[day][time];
        if (!section) continue;
        hasData = true;
        tempDay[time] = [...section];
      }

      if (hasData) tempDays[day] = tempDay;
    }

    return { courses: [...schedule.courses], term: schedule.term, name: schedule.name, sections: [...schedule.sections], times: tempDays, score: schedule.score, conflicts: [...schedule.conflicts] };
  }

  addCourse(schedule: Schedule, output: Schedule[], index: number = 0, type: number = 0) {
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

    if (index >= this.schedule.courses.length) {
      this.addCourse(schedule, output, 0, type + 1);
      return;
    }

    let data = this.schedule.courses[index].lectures;
    if (type === 1) data = this.schedule.courses[index].tutorials;
    else if (type === 2) data = this.schedule.courses[index].praticals;

    if (data.length === 0) {
      this.addCourse(schedule, output, index + 1, type);
      return;
    }

    for (let lec of data) {
      if (lec.sessions.length === 0) continue;
      if (!this.settings.allowFull && lec.curEnroll >= lec.maxEnroll) continue;

      if (this.isConflicting(schedule, lec)) continue;
      // await sleep(0);
      this.addSection(schedule, lec);
      this.addCourse(schedule, output, index + 1, type);
      this.popSection(schedule, lec);
    }
  }

  createSchedule(): void {
    let schedule: Schedule = { name: this.schedule.name, term: this.schedule.term, courses: [], sections: [], times: {}, score: 0, conflicts: [] };
    let output = [];
    this.scheduleCount = 0;
    let start = Date.now();
    this.addCourse(schedule, output);

    if (output.length === 0) {
      console.log("No Possible Schedules!");
    } else {
      console.log("New schedules:", output);
      console.log(`Found ${this.scheduleCount} possible schdules in ${(Date.now() - start) / 1000}s!`);
      this.scheduleOptions = output;
      this.nextOption();
    }

  }

  nextOption() {
    if (this.scheduleOptions.length === 0) return;

    this.scheduleOptionsInd += 1;
    if (this.scheduleOptionsInd < 0) this.scheduleOptionsInd = 0;
    if (this.scheduleOptionsInd >= this.scheduleOptions.length) this.scheduleOptionsInd -= this.scheduleOptions.length;

    this.schedule = this.scheduleOptions[this.scheduleOptionsInd];
    // this.session.data[0] = this.schedule;
    this.scheduleSubject.next(this.schedule);
  }
}

