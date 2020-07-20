import { Component, OnInit } from "@angular/core";
import { CourseService } from "../course.service";
import { Course, Dictionary } from "../definitions";
// import { Datasource } from "ngx-ui-scroll";
import { map, startWith, debounceTime, mergeMap, skipUntil, last, filter } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { FormControl } from "@angular/forms";
// import { binSearchLeft, binSearchRight } from "../helpers";


@Component({
  selector: "app-courses",
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.scss"]
})
export class CoursesComponent implements OnInit {
  // openItems: Dictionary<{ height: string, timeout?}> = {};
  // myControl = new FormControl();
  // // courses: Course[] = [];
  // activeItem: string;
  // datasource = new Datasource({
  //   get: (index, count, success) => {
  //     this.courseService.search(this.myControl.value, "2020F", index, count).then(data => success(data));
  //   },
  //   settings: {
  //     itemSize: 53,
  //     minIndex: 0,
  //     // maxIndex: 1,
  //     startIndex: 0,
  //   }
  // });

  constructor(public courseService: CourseService) {

    // , this.courseService.loadingSubject.pipe(filter(val => val === 1)))
    // this.myControl.valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     startWith(""),
    //     // mergeMap(([query, courses]) => this.courseService.search(query, 0, 1))
    //   ).subscribe((data) => {
    //     // this.datasource.settings.maxIndex = data.fullData.length;
    //     this.datasource.adapter.reload();
    //     // console.log(data);
    //   });

    // this.myControl.setValue("");
  }

  // formatAvailibility(item: Course) {
  //   let output = "Availiblity: ";
  //   // if (item.fillPercent === 0) output += "Empty";
  //   // else if (item.fillPercent === 1) output += "Full";
  //   // else output += (item.fillPercent * 100).toFixed(0) + "% Full";

  //   return output
  // }

  ngOnInit(): void {
  }

  // toggleOpened(item) {
  //   item.opened = !item.opened;
  //   this.datasource.adapter.check();
  // }

  // toggleExpand(item) {
  //   if (!item.listHeight) {
  //     if (this.activeItem) this.closeItem(this.activeItem);
  //     this.activeItem = item;
  //     this.openItem(item);
  //   } else {
  //     this.closeItem(item);
  //   }
  // }

  // openItem(item) {
  //   item.listOpen = true;
  //   if (item.listToggleTimeout) clearTimeout(item.listToggleTimeout);

  //   setTimeout(() => {
  //     let el = document.getElementById("list" + item.code);
  //     let clone = <HTMLElement>el.cloneNode(true);

  //     clone.style.transition = "none";
  //     clone.style.visibility = "hidden";
  //     clone.style.maxHeight = "9999px";
  //     clone.style.position = "absolute";
  //     el.appendChild(clone);

  //     setTimeout(() => {
  //       item.listHeight = clone.offsetHeight.toString();
  //       el.removeChild(clone);
  //     }, 0);

  //     setTimeout(() => {
  //       this.datasource.adapter.check();
  //     }, 750);
  //   }, 0);
  // }

  // closeItem(item) {
  //   item.listHeight = 0;
  //   if (item.listToggleTimeout) clearTimeout(item.listToggleTimeout);
  //   item.listToggleTimeout = setTimeout(() => {
  //     item.listOpen = false;
  //   }, 1000);
  // }

  // toggleExpand(item: Course) {
  //   if (item.code === this.activeItem) {
  //     this.openItems[item.code].height = "0";

  //     this.openItems[item.code].timeout = setTimeout(() => {
  //       delete this.openItems[item.code];
  //     }, 1000);
  //   } else {
  //     let closing = this.activeItem;
  //     if (this.openItems[closing]) {
  //       this.openItems[closing].height = "0";
  //       this.openItems[closing].timeout = setTimeout(() => {
  //         delete this.openItems[closing];
  //       }, 1000);
  //     }

  //     if (!this.openItems[item.code]) {
  //       this.openItems[item.code] = { height: "0" }
  //     } else {
  //       clearTimeout(this.openItems[item.code].timeout);
  //     }
  //     this.activeItem = item.code;
  //     this.openItems[item.code].height = "0";
  //     this.openItem(item);
  //   }
  // }

  // openItem(item: Course) {
  //   setTimeout(() => {
  //     let el = document.getElementById("list" + item.code);
  //     let clone = <HTMLElement>el.cloneNode(true);

  //     clone.style.transition = "none";
  //     clone.style.visibility = "hidden";
  //     clone.style.maxHeight = "9999px";
  //     clone.style.position = "absolute";
  //     el.appendChild(clone);

  //     setTimeout(() => {
  //       this.openItems[item.code].height = clone.offsetHeight.toString();
  //       el.removeChild(clone);
  //     }, 0);

  //     setTimeout(() => {
  //       this.datasource.adapter.check();
  //     }, 750);
  //   }, 0);
  // }

  // private _filter(value: string, courses: Course[]): Course[] {
  //   if (!value) return courses ? courses : [];
  //   const filterValue = value.toUpperCase();

  //   let left = binSearchLeft(filterValue, courses);
  //   let right = binSearchRight(filterValue, courses);
  //   return courses.slice(left, right);
  // }

  // search(value) {
  //   this.courses = this.courseService.search(value.toUpperCase());
  //   this.datasource.settings.maxIndex = this.courses.length;
  //   this.datasource.adapter.reset();
  // }

  getCourseCategory(code: string) {
    return code.substring(0, 3);
  }

  getCourseNumber(code: string) {
    return code.substring(3, code.length - 1);
  }

  getCourseAcademicSession(code: string) {
    return code.substring(code.length - 1);
  }

  // /*
  // * Check if the course is added in the array;
  // */
  // isAdded(code: string): boolean {
  //   let courses = this.timetableService.coursesSubject.value;
  //   if (!courses) return false;

  //   return courses.find(val => val?.code === code) != undefined;
  // }

}
