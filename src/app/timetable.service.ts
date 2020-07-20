import { Injectable } from "@angular/core";
import { Course, Section, Schedule, DAY_CODES, ScheduleData, CourseSection } from "./definitions";
import { Subject, BehaviorSubject } from "rxjs";
// import { MeetingSession } from "./definitions"
import { APIService } from "./API.service";
import { CourseService } from "./course.service";

@Injectable({
  providedIn: "root"
})
export class TimetableService {

  // courses: Course[] = [];
  // sessionSubject = this.degreeService.activeSessionSubject;
  // courses: Course[];
  // coursesSubject = new BehaviorSubject<Course[]>(null);
  scheduleData: ScheduleData = {
    courses: {},
    sections: {},
    conflicts: {},
    courseSections: {},
    schedule: {
      id: "100",
      year: "2020",
      term: "F",
      name: "2020 - Fall",
      courses: [],
      score: 0,
      times: {}
    }
  };

  scheduleSubject = new BehaviorSubject<ScheduleData>(this.scheduleData);
  // settings = { allowFull: true, scheduleCount: 10 };
  // // scheduleOptions: Schedule[] = [];
  // // scheduleOptionsInd = -1;
  // // scheduleCount = 0;

  constructor(private courseService: CourseService, private apiService: APIService) {
  }

  async setScheduleByID(id: string | null) {
    this.scheduleData = {
      courses: {},
      sections: {},
      conflicts: {},
      courseSections: {},
      schedule: {
        id: "100",
        year: "2020",
        term: "F",
        name: "2020 - Fall",
        courses: [],
        score: 0,
        times: {}
      }
    };

    try {
      if (id === null) { throw new Error("No ID"); }
      const data = await this.apiService.GetSchedule(id);
      this.scheduleData.schedule = { ...data, times: JSON.parse(data.times || ""), conflicts: [] } as Schedule;
    } catch (error) { }

    // Load data
    for (const courseOption of this.scheduleData.schedule.courses) {
      this.scheduleData.courses[courseOption.courseID] = await this.apiService.GetCourse(courseOption.courseID) as Course;
      await this.loadSections(courseOption.courseID);
    }

    // Populate conflicts
    for (const day of Object.keys(this.scheduleData.schedule.times)) {
      const dayTimes = this.scheduleData.schedule.times[day];
      for (const time of Object.keys(dayTimes)) {
        if (this.scheduleData.schedule.times[day][time].length > 1) {
          for (const section of this.scheduleData.schedule.times[day][time]) {
            if (section != null) {
              this.scheduleData.conflicts[section] = true;
            }
          }
        }
      }
    }
    this.scheduleData.schedule.times.MO = { 1: [null], 2: [null] };

    this.scheduleData = this.scheduleData;
    this.updateSchedule();
  }

  updateSchedule() {
    this.scheduleSubject.next(this.scheduleData);
  }

  async loadSections(courseID: string) {
    const sections = (await this.apiService.ByCourseIdCode(courseID)).items;

    const courseSections: CourseSection = {
      lectures: [],
      praticals: [],
      tutorials: []
    };

    if (sections) {
      for (const section of sections) {
        if (section) {
          if (section.code?.startsWith("LEC")) {
            courseSections.lectures.push(section.id);
          } else if (section.code?.startsWith("PRA")) {
            courseSections.praticals.push(section.id);
          } else if (section.code?.startsWith("TUT")) {
            courseSections.tutorials.push(section.id);
          }

          this.scheduleData.sections[section.id] = section as Section;
        }
      }
    }

    this.scheduleData.courseSections[courseID] = courseSections;
  }

  async selectCourse(course: Course) {
    if (this.scheduleData.schedule.courses.length >= 6 ||
      this.scheduleData.courseSections[course.id]) { return; }

    this.scheduleData.schedule.courses.push({
      courseID: course.id,
      autoLecture: true,
      autoPratical: true,
      autoTutorial: true
    });

    this.scheduleData.courses[course.id] = course;
    await this.loadSections(course.id);
    // this.schedule.coursesSubject.next(this.schedule.courses);

    // let lec = course.lectures[0];
    // if (lec) this.addSection(this.schedule, lec);

    // let pra = course.praticals[0];
    // if (pra) this.addSection(this.schedule, pra);

    // let tut = course.tutorials[0];
    // if (tut) this.addSection(this.schedule, tut);

    // this.scheduleSubject.next(this.scheduleData);
    this.updateSchedule();
  }

  // setSession(schedule: Schedule) {
  //   // this.schedule.courses = schedule.courses;
  //   // this.schedule.coursesSubject.next(this.schedule.courses);

  //   // if (!session)
  //   //   session.data = { sections: [], times: {}, score: 0, conflicts: [] };

  //   this.schedule = schedule;
  //   this.scheduleSubject.next(this.schedule);
  // }

  // removeCourse(course: Course): void {

  //   for (let i = this.schedule.sections.length - 1; i > -1; i--) {
  //     const element = this.schedule.sections[i];
  //     if (element.courseID === course.id)
  //       this.removeSection(this.schedule, element);
  //   }

  //   let ind = this.schedule.courses.findIndex(a => a.code === course.code);
  //   if (ind === -1) return;

  //   this.schedule.courses.splice(ind, 1);
  //   console.log(this.schedule);
  //   this.scheduleSubject.next(this.schedule);
  // }



  // createSchedule(): void {
  //   let schedule: Schedule = {
  //     name: this.schedule.name,
  //     term: this.schedule.term,
  //     courses: [],
  //     sections: [],
  //     times: {},
  //     score: 0,
  //     conflicts: []
  //   };
  //   let output = [];
  //   this.scheduleCount = 0;
  //   let start = Date.now();
  //   this.addCourse(schedule, output);

  //   if (output.length === 0) {
  //     console.log("No Possible Schedules!");
  //   } else {
  //     console.log("New schedules:", output);
  //     console.log(`Found ${this.scheduleCount} possible schdules in ${(Date.now() - start) / 1000}s!`);
  //     this.scheduleOptions = output;
  //     this.nextOption();
  //   }

  // }

  // nextOption() {
  //   if (this.scheduleOptions.length === 0) return;

  //   this.scheduleOptionsInd += 1;
  //   if (this.scheduleOptionsInd < 0) this.scheduleOptionsInd = 0;
  //   if (this.scheduleOptionsInd >= this.scheduleOptions.length) this.scheduleOptionsInd -= this.scheduleOptions.length;

  //   this.schedule = this.scheduleOptions[this.scheduleOptionsInd];
  //   // this.session.data[0] = this.schedule;
  //   this.scheduleSubject.next(this.schedule);
  // }

}

