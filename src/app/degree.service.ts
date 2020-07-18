import { Injectable } from '@angular/core';
import { Degree, DegreeYear } from './definitions';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DegreeService {

  degree: Degree = this.createDegree();
  // activeSessionSubject = new BehaviorSubject<AcademicSession>(null);
  constructor() {
  }

  getDegree() {
    return this.degree;
  }

  createDegree(): Degree {
    return {
      programs: [
        { name: "Computer Science", code: "ERMAJ1688 Major" },
        {
          name: "Communication, Culture, Information & Technology Jointly With Sheridan College",
          code: "ERMAJ1034 Major"
        },
        { name: "Computer Science", code: "ERMAJ1688 Major" },
      ],
      years: [
        this.createDegreeYear(1),
        this.createDegreeYear(2),
        this.createDegreeYear(3),
        this.createDegreeYear(4)
      ]
    }
  }

  createDegreeYear(level: number): DegreeYear {
    return {
      level: level, credits: 0, activeTerm: 0, schedules: {
        F: { term: "F", name: "Fall", courses: [], sections: [], times: {}, score: 0, conflicts: [] },
        S: { term: "S", name: "Winter", courses: [], sections: [], times: {}, score: 0, conflicts: [] },
        SF: { term: "SF", name: "Summer Fall", courses: [], sections: [], times: {}, score: 0, conflicts: [] },
        SS: { term: "SS", name: "Summer Winter", courses: [], sections: [], times: {}, score: 0, conflicts: [] }
      }
    };
  }
}

