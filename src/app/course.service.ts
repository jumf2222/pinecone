import { Injectable } from '@angular/core';
import { Course, Section, Dictionary } from './definitions';
import { saveAs } from 'file-saver';
import { binSearchRight, binSearchLeft } from './helpers';
import { BehaviorSubject, Observable } from 'rxjs';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { APIService } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  year = "2020";
  courses: Dictionary<Course> = {};
  sections: Dictionary<Section> = {};
  // academicSession = ACADEMIC_SESSIONS.PREV;

  // coursesSubject = new BehaviorSubject([]);
  // loadingSubject = new BehaviorSubject<number>(0);
  // coursesList: Course[] = [];
  // coursesDict: Dictionary<Course> = {};
  // searchResult: SearchResult = { query: null, data: [], startKey: null };
  // loaded: boolean = false;
  // yos = 2; 
  // api = "nikel";
  runningSearch = null;

  async getCourse(courseID) {
    let course = this.courses[courseID];
    if (!course) {
      course = await this.apiService.GetCourse(courseID);
      this.courses[courseID] = course;
    }

    return course;
    // coursesSubject
  }

  async getSection(sectionID) {
    let section = this.sections[sectionID];
    if (!section) {
      section = await this.apiService.GetSection(sectionID);
      this.sections[sectionID] = section;
    }

    return section;
    // coursesSubject
  }

  constructor(private http: HttpClient, private apiService: APIService) {

    // let requests = [];
    // for (let i = 0; i < 4; i++) {
    //   requests.push(this.loadCourseData(this.year, ACADEMIC_SESSIONS.PREV, i + 1));
    //   requests.push(this.loadCourseData(this.year, ACADEMIC_SESSIONS.SPRING, i + 1));
    // }

    // Promise.all(requests).then(data => {
    //   // let courses = [].concat(data[0], data[1], data[2]);

    //   this.coursesList.sort((a, b) => {
    //     if (a.code < b.code) return -1;
    //     if (a.code > b.code) return 1;
    //     return 0;
    //   });

    //   console.log("size", JSON.stringify(this.coursesList).length * 2);

    //   // this.coursesListSubject.next(this.coursesList);
    //   console.log("courses", this.coursesList);
    //   this.loadingSubject.next(1);
    //   // this.loadingSubject.complete();
    // });
  }

  // convertTimeString(time: string): number {
  //   let tokens = time.split(":");
  //   return parseInt(tokens[0]) * 2 + parseInt(tokens[1]) / 30;
  // }

  // parseSect(sectElement, course: Course) {
  //   let sect: Section = { sessions: [], syllabus: "", section: "", instructor: "", curEnroll: null, maxEnroll: null, notes: "", courseCode: course.code };

  //   if (sectElement.children[0].children[0])
  //     sect.syllabus = sectElement.children[0].children[0].href;

  //   sect.section = sectElement.children[1].children[0].textContent.trim();
  //   sect.instructor = sectElement.children[2].childNodes[0].textContent.trim();
  //   sect.curEnroll = parseInt(
  //     sectElement.children[3].childNodes[0].textContent
  //   );
  //   sect.maxEnroll = parseInt(
  //     sectElement.children[4].childNodes[0].textContent
  //   );
  //   sect.curEnroll += parseInt(
  //     sectElement.children[5].childNodes[0].textContent
  //   );
  //   sect.notes = sectElement.children[11].childNodes[0].textContent.trim();

  //   for (let i = 0; i < sectElement.children[7].children.length; i += 2) {
  //     sect.sessions.push({
  //       day: sectElement.children[7].children[i].textContent.trim(),
  //       start: this.convertTimeString(sectElement.children[8].childNodes[i].textContent.trim()),
  //       end: this.convertTimeString(sectElement.children[9].childNodes[i].textContent.trim()),
  //       room: sectElement.children[10].childNodes[i].textContent.trim(),
  //     });
  //   }

  //   return sect;
  // }

  // async loadCourseData(year, academicSession, yos) {
  //   // let courses = [];

  //   let res = await (
  //     await fetch(
  //       "https://cors-anywhere.herokuapp.com/" +
  //       `https://student.utm.utoronto.ca/timetable/timetable?yos=${yos}&session=${year}${academicSession}`,
  //       { cache: "force-cache" }
  //     )
  //   ).text();

  //   let element = new DOMParser().parseFromString(res, "text/html");

  //   let courseElements = element.body.getElementsByClassName("course");
  //   for (let j = 0; j < courseElements.length; j++) {
  //     let e = courseElements[j];
  //     let span = e.getElementsByTagName("span")[0];

  //     let code = span.getAttribute("id");
  //     let course: Course = this.coursesDict[code.substring(0, code.length - 1)];

  //     if (!course) {
  //       course = {
  //         name: "",
  //         distReq: "",
  //         code: code.substring(0, code.length - 1),
  //         description: "",
  //         prerequisites: "",
  //         exclusions: "",
  //         enrollControlsType: "",
  //         enrollControls: [],
  //         terms: {}
  //       };

  //       this.coursesDict[course.code] = course;
  //       this.coursesList.push(course);

  //       course.name = span.children[0].childNodes[0].textContent.split("-")[1].trim();

  //       if (span.children[0].childNodes[1]) {
  //         let distReq = span.children[0].childNodes[1].textContent.trim();
  //         course.distReq = distReq.substring(1, distReq.length - 1);
  //       }

  //       let info = e.getElementsByClassName("infoCourseDetails")[0];
  //       course.description = info.childNodes[0].textContent.trim();

  //       for (let i = 0; i < info.childNodes.length; i++) {
  //         let node = info.childNodes[i];

  //         if (node.textContent == "Exclusion: ") {
  //           course.exclusions = info.childNodes[++i].textContent.trim();
  //         } else if (node.textContent == "Prerequisites: ") {
  //           course.prerequisites = info.childNodes[++i].textContent.trim();
  //         }
  //       }

  //       let priority = e.getElementsByClassName("enrlControlsDefault");
  //       if (priority.length > 0) {
  //         course.enrollControlsType = priority[0].childNodes[1].textContent.split(":")[1].trim();

  //         let list = e.getElementsByClassName("enrollment_control")[0];
  //         let enrollElements = list.getElementsByTagName("li");

  //         for (let i = 0; i < enrollElements.length; i++)
  //           course.enrollControls.push(enrollElements[i].textContent.trim());
  //       }
  //     }

  //     let term: Term = {
  //       fillPercent: null,
  //       lecs: [],
  //       tuts: [],
  //       pras: [],
  //     }

  //     let lecElements = e.getElementsByClassName("LEC");
  //     let tutElements = e.getElementsByClassName("TUT");
  //     let praElements = e.getElementsByClassName("PRA");

  //     let curEnrollTotal = 0;
  //     let maxEnrollTotal = 0;

  //     for (let i = 0; i < lecElements.length; i++) {
  //       if (lecElements[i].getAttribute("id").startsWith("tr")) {
  //         let sect = this.parseSect(lecElements[i], course);
  //         curEnrollTotal += sect.curEnroll;
  //         maxEnrollTotal += sect.maxEnroll;
  //         term.lecs.push(sect);
  //       }
  //     }

  //     for (let i = 0; i < praElements.length; i++) {
  //       if (praElements[i].getAttribute("id").startsWith("tr")) {
  //         let sect = this.parseSect(praElements[i], course);
  //         term.pras.push(sect);

  //         if (maxEnrollTotal == 0) {
  //           curEnrollTotal += sect.curEnroll;
  //           maxEnrollTotal += sect.maxEnroll;
  //         }
  //       }
  //     }

  //     for (let i = 0; i < tutElements.length; i++) {
  //       if (tutElements[i].getAttribute("id").startsWith("tr")) {
  //         let sect = this.parseSect(tutElements[i], course);
  //         term.tuts.push(sect);

  //         if (maxEnrollTotal == 0) {
  //           curEnrollTotal += sect.curEnroll;
  //           maxEnrollTotal += sect.maxEnroll;
  //         }
  //       }
  //     }

  //     if (maxEnrollTotal > 0)
  //       term.fillPercent = curEnrollTotal / maxEnrollTotal;

  //     let termCode = academicSession === ACADEMIC_SESSIONS.SPRING ? "S" : "";
  //     course.terms[termCode + code.substring(code.length - 1)] = term;
  //   }

  //   // return courses;
  // }

  // getCourse(course: string): Course {
  //   return this.coursesDict[course];
  // }

  // async search(search: string, term: string, skip: number = 0, limit: number = 10): Promise<Course[]> {
  //   // return this.http.get(this.configUrl).pipe(map(a=>));
  //   if (!search) search = "";
  //   search = search.toUpperCase();
  //   console.log("request", search, skip, limit);
  //   if (skip < 0) skip = 0;
  //   if (limit < 0) limit = 0;

  //   let result = this.searchResult;

  //   // if (this.api === "nikel") {
  //   if (result.query != search || skip + limit > result.data.length) {
  //     if (result.query != search) {
  //       result.data = [];
  //       result.startKey = null;
  //       result.query = search;
  //     }

  //     while (skip + limit > result.data.length && result.startKey !== undefined) {
  //       let res = await (
  //         await fetch(
  //           // "https://cors-anywhere.herokuapp.com/" +
  //           // `https://nikel.ml/api/courses?code=${search}&offset=${result.fullData.length}`,
  //           `https://1d76a76xbj.execute-api.us-east-2.amazonaws.com/default/courses?code=${search}&term=${term}&limit=${Math.max(skip || 0, 20)}` + (result.startKey ? `&startKeyCode=${result.startKey.code}&startKeyTerm=${result.startKey.term}` : ""),
  //           // { cache: "force-cache" }
  //         )
  //       ).json();

  //       console.log("res", term, res);

  //       result.startKey = res.Items.length > 0 ? res.LastEvaluatedKey : undefined;

  //       for (const item of res.Items) {
  //         item.fillPercent = Math.random() * 2;
  //       }
  //       console.log("res", res, result);
  //       result.data.push(...res.Items);
  //     }
  //   }
  //   // } 
  //   // else {
  //   //   if (!search) {
  //   //     result.query = "";
  //   //     result.fullData = this.coursesList;
  //   //   } else {
  //   //     search = search.toUpperCase();

  //   //     if (result.query != search) {
  //   //       result.query = search;
  //   //       let start = binSearchLeft(search, this.coursesList);
  //   //       let end = binSearchRight(search, this.coursesList);
  //   //       result.fullData = this.coursesList.slice(start, end);
  //   //     }
  //   //   }
  //   // }

  //   let start = skip || 0;
  //   let end = (limit ? Math.min(result.data.length, start + limit) : result.data.length);
  //   // result.data = 

  //   console.log("result", result);
  //   return result.data.slice(start, end);
  // }

  // isLoaded() {
  //   return this.loaded;
  // }

  // downloadCourses() {
  //   // saveAs(new Blob([JSON.stringify(this.coursesListSubject.value)], { type: "application/json" }), `${this.year}${this.academicSession}${this.yos}.json`);
  // }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
