import { Injectable } from '@angular/core';
import { ACADEMIC_SESSIONS, Course, Section } from './definitions';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  loaded: boolean = false;

  constructor() {

  }

  year = "2020";
  academicSession = ACADEMIC_SESSIONS.PREV;
  yos = 3;
  courses: Array<Course> = [];

  parseSect(sectElement) {
    let sect: Section = { sessions: [], syllabus: "", section: "", instructor: "", curEnroll: null, maxEnroll: null, waitlistEnroll: null, notes: "" };

    if (sectElement.children[0].children[0])
      sect.syllabus = sectElement.children[0].children[0].href;

    sect.section = sectElement.children[1].children[0].textContent.trim();
    sect.instructor = sectElement.children[2].childNodes[0].textContent.trim();
    sect.curEnroll = parseInt(
      sectElement.children[3].childNodes[0].textContent
    );
    sect.maxEnroll = parseInt(
      sectElement.children[4].childNodes[0].textContent
    );
    sect.waitlistEnroll = parseInt(
      sectElement.children[5].childNodes[0].textContent
    );
    sect.notes = sectElement.children[11].childNodes[0].textContent.trim();

    for (let i = 0; i < sectElement.children[7].children.length; i += 2) {
      sect.sessions.push({
        day: sectElement.children[7].children[i].textContent.trim(),
        start: sectElement.children[8].childNodes[i].textContent.trim(),
        end: sectElement.children[9].childNodes[i].textContent.trim(),
        room: sectElement.children[10].childNodes[i].textContent.trim(),
      });
    }

    return sect;
  }

  async getCourseData(year, academicSession, yos): Promise<Array<Course>> {
    let courses = [];

    let res = await (
      await fetch(
        "https://cors-anywhere.herokuapp.com/" +
        `https://student.utm.utoronto.ca/timetable/timetable?yos=${this.yos}&session=${this.year}${this.academicSession}`,
        { cache: "force-cache" }
      )
    ).text();

    let element = new DOMParser().parseFromString(res, "text/html");

    let courseElements = element.body.getElementsByClassName("course");
    for (let j = 0; j < courseElements.length; j++) {
      let e = courseElements[j];

      let course: Course = {
        name: "",
        fillPercent: null,
        description: "",
        lecs: [],
        tuts: [],
        pras: [],
        prerequisites: "",
        exclusions: "",
        enrollControlsType: "",
        enrollControls: [],
      };

      let span = e.getElementsByTagName("span")[0];
      course.name = span.getAttribute("id");

      let info = e.getElementsByClassName("infoCourseDetails")[0];
      course.description = info.childNodes[0].textContent.trim();

      for (let i = 0; i < info.childNodes.length; i++) {
        let node = info.childNodes[i];

        if (node.textContent == "Exclusion: ") {
          course.exclusions = info.childNodes[++i].textContent.trim();
        } else if (node.textContent == "Prerequisites: ") {
          course.prerequisites = info.childNodes[++i].textContent.trim();
        }
      }

      let priority = e.getElementsByClassName("enrlControlsDefault");
      if (priority.length > 0) {
        course.enrollControlsType = priority[0].childNodes[1].textContent.split(":")[1].trim();

        let list = e.getElementsByClassName("enrollment_control")[0];
        let enrollElements = list.getElementsByTagName("li");

        for (let i = 0; i < enrollElements.length; i++)
          course.enrollControls.push(enrollElements[i].textContent.trim());
      }

      let lecElements = e.getElementsByClassName("LEC");
      let tutElements = e.getElementsByClassName("TUT");
      let praElements = e.getElementsByClassName("PRA");

      let curEnrollTotal = 0;
      let maxEnrollTotal = 0;

      for (let i = 0; i < lecElements.length; i++) {
        let sect = this.parseSect(lecElements[i]);
        curEnrollTotal += sect.curEnroll;
        maxEnrollTotal += sect.maxEnroll;
        course.lecs.push(sect);
      }

      for (let i = 0; i < tutElements.length; i++)
        course.tuts.push(this.parseSect(tutElements[i]));

      for (let i = 0; i < praElements.length; i++)
        course.pras.push(this.parseSect(praElements[i]));

      if (maxEnrollTotal > 0)
        course.fillPercent = curEnrollTotal / maxEnrollTotal;
      courses.push(course);
    }
    return courses;
  }

  async search(search: string) {
    if (!this.loaded) {
      this.courses = await this.getCourseData(this.year, this.academicSession, this.yos);
      // await sleep(3000);
      this.loaded = true;
    }
    return this.courses.filter(item => { return item.name.includes(search) });
  }

  isLoaded() {
    return this.loaded;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
