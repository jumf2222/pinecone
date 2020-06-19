import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, EventSettingsModel, View } from '@syncfusion/ej2-angular-schedule';
import { TimetableService } from '../timetable.service';
import { SchedulerDataSource } from '../definitions';
import { scheduled } from 'rxjs';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
})
export class ScheduleComponent implements OnInit {
  public virtualscroll: boolean = true;
  public currentView: View = 'Week';
  dataSource: Array<SchedulerDataSource> = [];
  constructor(private timetableService: TimetableService) { }
  // public selectedDate: Date = new Date(2018, 1, 15);
  public eventSettings: EventSettingsModel = {
    dataSource: this.dataSource
  };
  index = 0;
  ngOnInit(): void {
    // edit this to add to the schedule
    // this.timetableService.coursesSubject.subscribe((selectedCourses) => {
    //   console.log(selectedCourses);
    //   selectedCourses.forEach((selectedCourse) => {
    //     selectedCourse.lecs.forEach(lecture => {

    //       lecture.sessions.forEach(sessions => {

    //         this.dataSource.push({
    //           Id: this.index++,
    //           Subject: selectedCourse.code + " </br>" + lecture.section,
    //           StartTime: new Date(2020, 5, 8, Number(sessions.start.split(":")[0]), Number(sessions.start.split(":")[1])),
    //           EndTime: new Date(2020, 5, 8, Number(sessions.end.split(":")[0]), Number(sessions.end.split(":")[1])),
    //           FREQ: "FREQ=WEEKLY;INTERVAL=1;BYDAY=" + sessions["day"]
    //         })
    //       })
    //     });


    //   });

    //   console.log(this.dataSource);
    // });

  }

}
