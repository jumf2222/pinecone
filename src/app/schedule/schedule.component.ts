import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { TimetableService } from "../timetable.service";
import { Course, Schedule, Section, ScheduleData, DAY_CODES } from "../definitions";
import { FormControl } from "@angular/forms";
import { map, startWith, debounceTime, mergeMap, skipUntil, last, filter } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { CourseService } from "../course.service";
// import { binSearchLeft, binSearchRight } from "../helpers";
// import { Datasource } from "ngx-ui-scroll";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ActivatedRoute } from "@angular/router";
import { deepStrictEqual } from 'assert';
// import { DegreeService } from "../degree.service";

interface SlotData {
  texts: string[];
  style: {};
  conflicts: boolean;
}

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit {
  form = new FormControl();
  filteredCourses: Course[] = [];
  courses: Course[] = [];
  height = "";

  // filteredOptions: Course[];
  scheduleData: ScheduleData;
  slotData: Array<SlotData[]> = [];
  // conflicts: Section[] = [];

  DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  // TIMES: number[] = [];
  COLOURS: string[] = [
    "#FDDEF9",
    "#FFC5F8",

    "#F0DEFD",
    "#E1B8FF",

    "#DEF3FD",
    "#A1E1FF",

    "#DEFDE0",
    "#A2FFA8",

    "#FCF7DE",
    "#FFF3B7",

    "#FFE8DE",
    "#FFBA9C",
  ];

  // year: DegreeYear = null;

  // focusTimeout;
  // focused: boolean = false;
  // butFocused: boolean = false;
  // datasource = new Datasource({
  //   get: (index, count, success) => {
  //     this.courseService.search(this.myControl.value, "2020" + this.scheduleData.term, index, count).then(data => success(data));
  //   },
  //   settings: {
  //     itemSize: 53,
  //     minIndex: 0,
  //     // maxIndex: 1,
  //     startIndex: 0,
  //   }
  // });

  formatDay(day: string) {
    return day.substring(0, 3);
  }

  formatTime(time: number) {
    const hour = Math.floor(time / 2);
    return `${(hour === 0 ? "12" : (hour - 1) % 12 + 1).toString().padStart(2, " ")}:${(time % 2 * 30).toString().padStart(2, "0") + (hour / 12 < 1 ? " AM" : " PM")}`;
  }

  constructor(
    public timetableService: TimetableService,
    private courseService: CourseService,
    private route: ActivatedRoute,
  ) {
    this.scheduleData = this.timetableService.scheduleSubject.value;
    for (let i = 0; i < 48; i++) {
      this.slotData.push([]);
      for (let j = 0; j < 5; j++) {
        this.slotData[i][j] = { texts: [], style: {}, conflicts: false };
      }
    }
    // for (let i = 16; i < 44; i++) {
    //   this.TIMES.push(i);
    // }

    // for (let i = 0; i < 18; i++) {
    //   this.COLOURS.push("rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")");
    // }
  }

  // setFocus(focus: boolean) {
  //   if (this.focusTimeout) clearTimeout(this.focusTimeout);

  //   if (focus) {
  //     this.focused = focus;
  //     if (this.myControl.value === null) {
  //       console.log("called");
  //       // this.updateOptions(this.courseService.coursesSubject.value);
  //     }
  //   } else {
  //     this.focusTimeout = setTimeout(() => {
  //       this.focused = focus;
  //     }, 0);
  //   }
  // }

  generateSlotData() {
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < 5; j++) {
        this.updateSlotData(i, j);
      }
    }
  }

  updateSlotData(time: number, col: number): void {
    const day = DAY_CODES[col];
    const data = this.slotData[time][col];

    const sections = this.getSections(day, time);
    if (!sections) {
      data.texts = [];
      data.style = {};
      data.conflicts = false;
      return;
    }

    let prevSections = this.getSections(day, time - 1);
    if (!prevSections) { prevSections = []; }

    const outputStrings: string[] = [];
    for (const sect of sections) {
      if (!prevSections.find(a => a === sect) && sect) {
        const curSection = this.scheduleData.sections[sect];
        const curCourse = this.scheduleData.courses[curSection.courseID];

        outputStrings.push(curSection.code);
        outputStrings.push(curCourse.code);
      }
    }

    for (const sect of sections) {
      if (sect && this.scheduleData.conflicts[sect]) {
        data.style = { background: "#4A4A4A", color: "#FFBB00", borderBottom: "none" };
        data.conflicts = true;
        data.texts = outputStrings;
        return;
      }
    }

    if (!sections[0]) {
      data.style = { background: "grey", borderBottom: "none" };
      data.conflicts = false;
      data.texts = outputStrings;
    } else {
      const section = this.scheduleData.sections[sections[0]];
      let type = section.code.startsWith("LEC") ? 0 : 1;
      type = this.scheduleData.schedule.courses.findIndex(a => a.courseID === section.courseID) * 2 + type;
      data.style = { background: this.COLOURS[type], borderBottom: "none" };
      data.conflicts = false;
      data.texts = outputStrings;
    }
  }

  clickSlot(row: number, col: number) {
    let dayTimes = this.scheduleData.schedule.times[DAY_CODES[col]];
    if (!dayTimes) {
      dayTimes = {};
      this.scheduleData.schedule.times[DAY_CODES[col]] = dayTimes;
    }
    if (!dayTimes[row]) {
      dayTimes[row] = [];
    }

    if (dayTimes[row].length === 0) {
      dayTimes[row].push(null);
      this.timetableService.updateSchedule();
    }
    else if (dayTimes[row][0] === null) {
      delete dayTimes[row];
      this.timetableService.updateSchedule();
    }
    else {
      // OPEN INFO;
    }
    console.log("clicked", row, col);
  }

  getSections(day: string, time: number): (string | null)[] | null {
    day = day.substring(0, 2).toUpperCase();
    if (!this.scheduleData.schedule.times.hasOwnProperty(day) ||
      !this.scheduleData.schedule.times[day].hasOwnProperty(time)) { return null; }
    return this.scheduleData.schedule.times[day][time];
  }

  selectCourse(course: Course) {
    this.form.setValue("");
    this.timetableService.selectCourse(course);
  }

  ngOnInit() {
    // Listen for changes to the inputt

    this.timetableService.scheduleSubject.subscribe(async scheduleData => {
      // if (!scheduleData) { return; }

      // for (const course of scheduleData.courses) {
      //   await this.courseService.getCourse(course);
      // }

      // for (const section of scheduleData.sections) {
      //   await this.courseService.getSection(section);
      // }

      this.scheduleData = scheduleData;
      this.generateSlotData();

      console.log("scheduleData", scheduleData);
    });
    // this.timetableService.coursesSubject.subscribe(courses => { console.log("selected", courses); })
    this.route.queryParamMap.subscribe(async params => {
      await this.timetableService.setScheduleByID(params.get("scheduleData"));

      const data = await this.courseService.ByYearTermCampusCode(this.scheduleData.schedule.year,
        { beginsWith: { term: this.scheduleData.schedule.term, campus: "H5" } },
        undefined, undefined, 10000);

      this.courses = data.items as Course[];
      console.log("courses", data);
      // if ();
      // let yearLevel = parseInt(params.get("level")) || 1;

      // if (yearLevel < 1) yearLevel = 1;
      // if (yearLevel > 4) yearLevel = 4;

      // let degree = this.degreeService.getDegree();
      // let year = degree.years.find(year => year?.level === yearLevel);

      // if (!year) year = degree.years[0];

      // let scheduleData = Object.values(year.schedules).find(a => a.name === scheduleName);

      // if (!scheduleData) scheduleData = year.schedules["F"];

      // this.year = year;
      // this.scheduleData = scheduleData;
      // this.timetableService.setSession(scheduleData);

      console.log("sc", this.scheduleData);
    });

    this.form.valueChanges
      .pipe(
        startWith(""),
        map(value => {
          console.log("value", value);
          if (typeof value !== "string") { return; }

          // Filter the options
          this.filteredCourses = this.courses.filter(option => option.code.toLowerCase().startsWith(value.toLowerCase()));
          console.log(this.filteredCourses);

          // Recompute how big the viewport should be.
          if (this.filteredCourses.length < 4) {
            this.height = (this.filteredCourses.length * 50) + "px";
          } else {
            this.height = "200px";
          }
        })
      ).subscribe();

    // this.courseService.coursesSubject.subscribe(courses => {
    //   this.updateOptions(courses);
    // });
    // combineLatest(this.myControl.valueChanges, this.courseService.loadingSubject.pipe(filter(val => val === 1)))
    //   .pipe(
    //     debounceTime(300),
    //     startWith(""),
    //     mergeMap(([query, courses]) => this.courseService.search(query, 0, 1))
    //   ).subscribe((data) => {
    //     this.datasource.settings.maxIndex = data.fullData.length;
    //     this.datasource.adapter.reset();
    //     console.log(data);
    //   });

    // this.myControl.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     startWith(""),
    //     // mergeMap((query) => this.courseService.search(query, 0, 1))
    //   ).subscribe(() => {
    //     // this.datasource.settings.maxIndex = 632;
    //     // this.datasource.adapter.eof = false;
    //     this.datasource.adapter.reload();
    //     // console.log(data);
    //   });

    // this.myControl.setValue("");
  }

  displayFn(course: Course): string {
    return course && course.code ? course.code : "";
  }

  // private _filter(value: string, courses: Course[]): Course[] {
  //   if (!value) return courses ? courses : [];
  //   const filterValue = value.toUpperCase();

  //   let left = binSearchLeft(filterValue, courses);
  //   let right = binSearchRight(filterValue, courses);
  //   return courses.slice(left, right);
  // }

  // selectedCourse(event: MatAutocompleteSelectedEvent) {
  //   event.option.deselect();
  // }

}
