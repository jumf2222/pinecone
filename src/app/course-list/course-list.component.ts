import { Component, OnInit, ElementRef } from '@angular/core';
import { CourseService } from '../course.service';
import { Course } from '../definitions';
import { TimetableService } from '../timetable.service';
// import { IDatasource, Datasource } from 'ngx-ui-scroll';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  // openItems = {};
  // activeItem;
  // courses: Course[];

  // datasource = new Datasource({
  //   get: (index, count, success) => {
  //     success(.value.slice(index, index + count));
  //   },
  //   settings: {
  //     itemSize: 50,
  //     minIndex: 0,
  //     startIndex: 0,
  //   }
  // });

  constructor(public timetableService: TimetableService) {
    // this.timetableService.coursesSubject.subscribe(data => {
    //   if (data) {
    //     this.datasource.settings.maxIndex = data.length;
    //     this.datasource.adapter.reset();
    //   }
    // });
  }

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
  //     let el = document.getElementById("sel" + item.code);
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

  ngOnInit(): void {


  }

  formatCode(code: string) {
    return code.substring(0, 3) + " " + code.substring(3, code.length - 1) + " " + code.substring(code.length - 1);
  }
  getCode(code: string, index: number) {
    return this.formatCode(code).split(" ")[index];
  }

  // scroll(id, event) {
  //   console.log(`scrolling to ${id}`);
  //   // event.stopPropagation();
  //   // let el = document.getElementById(id);
  //   // el.scrollIntoView({ behavior: 'smooth' });
  // }

}