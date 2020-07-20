/// <reference lib="webworker" />
import { Course, Section, Schedule, DAY_CODES, Dictionary } from "./definitions";

addEventListener("message", ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});


class ScheduleCreator {

  // removeSection(schedule: Schedule, newSect: Section): void {

  //   let ind = this.reference.sections.findIndex(a => a.code === newSect.code);
  //   console.log("new sect", newSect, ind);
  //   if (ind === -1) return;

  //   schedule.sections = schedule.sections.splice(ind, 1);
  //   for (const newSess of newSect.sessions) {
  //     console.log("sess", newSess);

  //     let day = schedule.times[newSess.day];
  //     for (let i = newSess.start; i < newSess.end; i++) {
  //       if (!day[i]) continue;

  //       console.log("groupInd", day[i].findIndex(a => a === newSect));
  //       day[i].splice(day[i].findIndex(a => a === newSect), 1);
  //       if (day[i].length === 0) {
  //         day[i] = undefined;
  //         // console.log("deleted");
  //       }
  //     }
  //   }
  // }

  /**
   * Check if a section conflicts with a schedule
   */
  isConflicting(schedule: Schedule, section: Section): boolean {
    for (const newSess of section.sessions) {
      const day = schedule.times[newSess.day];
      if (day === schedule.times[newSess.day]) { continue; }

      for (let i = newSess.start; i < newSess.end; i++) {
        if (day[i]) { return true; }
      }
    }
    return false;
  }

  // addSection(schedule: Schedule, section: Section): void {
  //   schedule.sections.push(section);
  //   for (const newSess of section.sessions) {

  //     if (!schedule.times[newSess.day]) schedule.times[newSess.day] = {};
  //     let day = schedule.times[newSess.day];

  //     for (let i = newSess.start; i < newSess.end; i++) {
  //       if (day[i])
  //         schedule.conflicts.push(section);
  //       else
  //         day[i] = [];

  //       day[i].push(section);
  //     }
  //   }
  // }


  /**
   * Add a section without conflict checking
   */
  private pushSection(schedule: Schedule, section: Section): void {
    schedule.sections.push(section.id);

    for (const newSess of section.sessions) {

      if (!schedule.times[newSess.day]) { schedule.times[newSess.day] = {}; }
      const day = schedule.times[newSess.day];

      for (let i = newSess.start; i < newSess.end; i++) {
        day[i] = [section.id];
      }
    }
  }

  /**
   * Remove a section without object cleaning
   */
  private popSection(schedule: Schedule, newSect: Section): void {
    schedule.sections.pop();
    for (const newSess of newSect.sessions) {

      const day = schedule.times[newSess.day];
      for (let i = newSess.start; i < newSess.end; i++) {
        day[i].pop();
      }
    }
  }

  scoreSchedule(schedule: Schedule): void {
    let total = 0;
    for (const day of DAY_CODES) {
      let begin = 100;
      let end = 0;
      let dayTotal = 0;

      if (day in schedule.times) {
        const dayTimes = schedule.times[day];
        for (const timeString in dayTimes) {
          if (dayTimes[timeString]) {
            const time = parseInt(timeString, 10);
            if (time < begin) { begin = time; }
            if (time > end) { end = time; }
            dayTotal++;
          }
        }
      }

      if (begin >= end) {
        total += 18;
      } else {
        total -= (end - begin + 1) - dayTotal;
      }
    }

    schedule.score = total;
  }

  /**
   * Deep copy a schedule with object cleaning
   */
  copySchedule(schedule: Schedule): Schedule {
    const tempDays: Dictionary<Dictionary<string[]>> = {};

    for (const day of Object.keys(schedule.times)) {
      let hasData = false;
      const tempDay: Dictionary<string[]> = {};

      for (const time of Object.keys(schedule.times[day])) {
        const section = schedule.times[day][time];
        if (!section) { continue; }
        hasData = true;
        tempDay[time] = [...section];
      }

      if (hasData) { tempDays[day] = tempDay; }
    }

    return {
      id: schedule.id,
      year: schedule.year,
      term: schedule.term,
      name: schedule.name,
      courses: [...schedule.courses],
      sections: [...schedule.sections],
      autoLectures: [...schedule.autoLectures],
      autoPraticals: [...schedule.autoPraticals],
      autoTutorials: [...schedule.autoTutorials],
      score: schedule.score,
      conflicts: [...schedule.conflicts],
      times: tempDays,
    };
  }

  // private autoAddCourse(
  //   schedule: Schedule,
  //   settings = { allowFull: true, scheduleCount: 10 },
  //   groups: Array<Section[]>,
  //   output: Schedule[],
  //   groupInd: number = 0,
  //   threads: number = 1,
  //   threadInd: number = 0,
  //   first: boolean = false,
  // ) {

  //   if (groupInd > groups.length) {
  //     this.scoreSchedule(schedule);

  //     for (let i = 0; i < output.length; i++) {
  //       if (output[i].score < schedule.score) {
  //         output.splice(i, 0, this.copySchedule(schedule));
  //         if (output.length > settings.scheduleCount) output.pop();
  //         return;
  //       }
  //     }

  //     if (output.length < settings.scheduleCount) output.push(this.copySchedule(schedule));
  //     return;
  //   }

  //   if (groupInd >= this.reference.courses.length) {
  //     this.autoAddCourse(schedule, output, 0, type + 1);
  //     return;
  //   }

  //   let data = this.reference.courses[groupInd].lectures;
  //   if (type === 1) data = this.reference.courses[groupInd].tutorials;
  //   else if (type === 2) data = this.reference.courses[groupInd].praticals;

  //   if (data.length === 0) {
  //     this.autoAddCourse(schedule, output, groupInd + 1, type);
  //     return;
  //   }

  //   for (let lec of data) {
  //     if (lec.sessions.length === 0) continue;
  //     if (!this.settings.allowFull && lec.curEnroll >= lec.maxEnroll) continue;

  //     if (this.isConflicting(schedule, lec)) continue;
  //     // await sleep(0);
  //     this.pushSection(schedule, lec);
  //     this.autoAddCourse(schedule, output, groupInd + 1, type);
  //     this.popSection(schedule, lec);
  //   }
  // }

  // createSchedule(): void {
  //   let schedule: Schedule = { name: this.schedule.name, term: this.schedule.term, courses: [],
  // sections: [], times: {}, score: 0, conflicts: [] };
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
}
