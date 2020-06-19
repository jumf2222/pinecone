import { Component } from '@angular/core';
import { CourseService } from './course.service';
import { TimetableService } from './timetable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pinecone';

  constructor(public courseService: CourseService, public timetableService: TimetableService) { }
}
