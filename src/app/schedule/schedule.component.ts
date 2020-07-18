import { Component, OnInit, ViewChild } from '@angular/core';
import { TimetableService } from '../timetable.service';
import { Course, Schedule, Section } from '../definitions';
import { FormControl } from '@angular/forms';
import { map, startWith, debounceTime, mergeMap, skipUntil, last, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { CourseService } from '../course.service';
import { binSearchLeft, binSearchRight } from '../helpers';
// import { Datasource } from 'ngx-ui-scroll';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { DegreeService } from '../degree.service';
import { APIService, ModelSortDirection, ModelCourseFilterInput, ByYearTermCodeCampusQuery, ModelCourseByYearTermCodeCampusCompositeKeyConditionInput } from '../API.service';
import API, { graphqlOperation } from "@aws-amplify/api";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [],
})
export class ScheduleComponent implements OnInit {
  form = new FormControl();
  filteredCourses;
  courses = [];
  height: string;

  // filteredOptions: Course[];
  schedule: Schedule;

  DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  TIMES: number[] = [];
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
  ]

  // year: DegreeYear = null;

  // focusTimeout;
  // focused: boolean = false;
  // butFocused: boolean = false;
  // datasource = new Datasource({
  //   get: (index, count, success) => {
  //     this.courseService.search(this.myControl.value, "2020" + this.schedule.term, index, count).then(data => success(data));
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
    let hour = Math.floor(time / 2);
    return ((hour - 1) % 12 + 1).toString().padStart(2, "0") + ":" + (time % 2 * 30).toString().padStart(2, "0") + (hour / 12 < 1 ? " AM" : " PM");
  }

  constructor(
    public timetableService: TimetableService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private degreeService: DegreeService,
    private apiService: APIService
  ) {
    for (let i = 16; i < 44; i++) {
      this.TIMES.push(i);
    }

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

  async getSlotData(day: string, time: number) {
    let sections = this.getSections(day, time);
    if (!sections) return {};

    let prevSections = this.getSections(day, time - 1);
    if (!prevSections) prevSections = [];

    let outputStrings = [];
    for (const sect of sections) {
      if (!prevSections.find(a => a === sect)) {
        let courseID = this.timetableService.schedule.courses.find(a => a === sect);
        let course: Course = await this.courseService.getCourse(courseID);
        let section = await this.courseService.getSection(sect);
        outputStrings.push(course.code);
        outputStrings.push(section.code);
      }
    }

    let output: any = { texts: outputStrings };

    for (const sect of sections) {
      if (this.schedule.conflicts.find(a => a === sect)) {
        output.style = { background: "#4A4A4A", color: "#FFBB00", borderBottom: "none" };
        output.conflicts = true;
        return output;
      }
    }

    let section = await this.courseService.getSection(sections[0]);
    let type = section.code.startsWith("LEC") ? 0 : 1;
    type = this.timetableService.schedule.courses.findIndex(a => a === section.courseID) * 2 + type;
    output.style = { background: this.COLOURS[type], borderBottom: "none" };
    return output;
  }

  getSections(day: string, time: number): string[] {
    day = day.substring(0, 2).toUpperCase();
    if (!this.schedule.times.hasOwnProperty(day) ||
      !this.schedule.times[day].hasOwnProperty(time)) return null;
    return this.schedule.times[day][time];
  }

  async ngOnInit() {
    // Listen for changes to the inputt

    this.timetableService.scheduleSubject.subscribe(schedule => { this.schedule = schedule; console.log("schedule", schedule); })
    // this.timetableService.coursesSubject.subscribe(courses => { console.log("selected", courses); })
    this.route.queryParamMap.subscribe(params => {
      this.timetableService.setScheduleByID(params.get("schedule"));

      // if ();
      // let yearLevel = parseInt(params.get("level")) || 1;

      // if (yearLevel < 1) yearLevel = 1;
      // if (yearLevel > 4) yearLevel = 4;

      // let degree = this.degreeService.getDegree();
      // let year = degree.years.find(year => year?.level === yearLevel);

      // if (!year) year = degree.years[0];

      // let schedule = Object.values(year.schedules).find(a => a.name === scheduleName);

      // if (!schedule) schedule = year.schedules["F"];

      // this.year = year;
      // this.schedule = schedule;
      // this.timetableService.setSession(schedule);

      console.log("sc", this.schedule);
    });

    let data = await this.ByYearTermCodeCampus("2020", { beginsWith: { term: this.schedule.term } }, null, null, 10000);
    this.courses = data.items;
    console.log("courses", data);

    this.form.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          console.log("value", value);
          if (typeof value !== 'string') return;

          // Filter the options
          this.filteredCourses = this.courses.filter(option => option.code.toLowerCase().startsWith(value.toLowerCase()));
          console.log(this.filteredCourses);

          // Recompute how big the viewport should be.
          if (this.filteredCourses.length < 4) {
            this.height = (this.filteredCourses.length * 50) + 'px';
          } else {
            this.height = '200px'
          }
        })
      ).subscribe();

    // this.courseService.coursesSubject.subscribe(courses => {
    //   this.updateOptions(courses);
    // });
    // combineLatest(this.myControl.valueChanges, this.courseService.loadingSubject.pipe(filter(val => val === 1)))
    //   .pipe(
    //     debounceTime(300),
    //     startWith(''),
    //     mergeMap(([query, courses]) => this.courseService.search(query, 0, 1))
    //   ).subscribe((data) => {
    //     this.datasource.settings.maxIndex = data.fullData.length;
    //     this.datasource.adapter.reset();
    //     console.log(data);
    //   });

    // this.myControl.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     startWith(''),
    //     // mergeMap((query) => this.courseService.search(query, 0, 1))
    //   ).subscribe(() => {
    //     // this.datasource.settings.maxIndex = 632;
    //     // this.datasource.adapter.eof = false;
    //     this.datasource.adapter.reload();
    //     // console.log(data);
    //   });

    // this.myControl.setValue('');
  }

  displayFn(course): string {
    return course && course.code ? course.code : '';
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

  async ByYearTermCodeCampus(
    year?: string,
    termCodeCampus?: ModelCourseByYearTermCodeCampusCompositeKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelCourseFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ByYearTermCodeCampusQuery> {
    const statement = `query ByYearTermCodeCampus($year: String, $termCodeCampus: ModelCourseByYearTermCodeCampusCompositeKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelCourseFilterInput, $limit: Int, $nextToken: String) {
        byYearTermCodeCampus(year: $year, termCodeCampus: $termCodeCampus, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            code
            campus
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (year) {
      gqlAPIServiceArguments.year = year;
    }
    if (termCodeCampus) {
      gqlAPIServiceArguments.termCodeCampus = termCodeCampus;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ByYearTermCodeCampusQuery>response.data.byYearTermCodeCampus;
  }

  selectCourse(course: Course) {
    this.form.setValue("");
    this.timetableService.selectCourse(course);
  }

}