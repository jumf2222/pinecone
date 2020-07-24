import { Course, Section, Schedule, DAY_CODES, Dictionary, ScheduleData } from "./definitions";

export class ScheduleCreator {

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
                if (day[i] && day[i].length > 0) { return true; }
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

    selectSection(scheduleData: ScheduleData, section: string): boolean {
        const sect = scheduleData.sections[section];

        // Check possible
        for (const newSess of sect.sessions) {

            if (!scheduleData.schedule.times[newSess.day]) { continue; }
            const day = scheduleData.schedule.times[newSess.day];

            for (let i = newSess.start; i < newSess.end; i++) {
                if (!day[i]) { continue; }
                if (day[i].includes(null)) { return false; }
            }
        }

        // Remove old
        for (const day of Object.keys(scheduleData.schedule.times)) {
            for (const time of Object.keys(scheduleData.schedule.times[day])) {
                const sections = scheduleData.schedule.times[day][time];

                for (let ind = sections.length - 1; ind > -1; ind--) {
                    const sectID = sections[ind];
                    if (!sectID) { continue; }

                    const oldSect = scheduleData.sections[sectID];
                    if (oldSect.courseID === sect.courseID && oldSect.code.startsWith(sect.code.substring(0, 3))) {
                        sections.splice(ind, 1);
                    }
                }
            }
        }

        // Add New
        if (sect.method === "ASYNC") {
            if (!scheduleData.schedule.times.ASYNC) { scheduleData.schedule.times.ASYNC = {}; }
            if (!scheduleData.schedule.times.ASYNC["0"]) { scheduleData.schedule.times.ASYNC["0"] = []; }
            scheduleData.schedule.times.ASYNC["0"].push(section);
        } else {
            for (const newSess of sect.sessions) {

                if (!scheduleData.schedule.times[newSess.day]) { scheduleData.schedule.times[newSess.day] = {}; }
                const day = scheduleData.schedule.times[newSess.day];

                for (let i = newSess.start; i < newSess.end; i++) {
                    if (!day[i]) { day[i] = []; }
                    day[i].push(sect.id);
                }
            }
        }

        return true;
    }

    removeCourse(scheduleData: ScheduleData, course: string) {
        for (const day of Object.keys(scheduleData.schedule.times)) {
            for (const time of Object.keys(scheduleData.schedule.times[day])) {
                const sections = scheduleData.schedule.times[day][time];

                for (let ind = sections.length - 1; ind > -1; ind--) {
                    const sectID = sections[ind];
                    if (!sectID) { continue; }

                    const oldSect = scheduleData.sections[sectID];
                    if (oldSect.courseID === course) {
                        sections.splice(ind, 1);
                    }
                }
            }
        }

        const courseInd = scheduleData.schedule.courses.findIndex(a => a.courseID === course);
        scheduleData.schedule.courses.splice(courseInd, 1);

        for (const sect of scheduleData.courseSections[course].lectures) {
            delete scheduleData.sections[sect];
        }
        for (const sect of scheduleData.courseSections[course].tutorials) {
            delete scheduleData.sections[sect];
        }
        for (const sect of scheduleData.courseSections[course].praticals) {
            delete scheduleData.sections[sect];
        }

        delete scheduleData.courseSections[course];
        delete scheduleData.courses[course];
    }


    /**
     * Add a section without conflict checking
     */
    private pushSection(schedule: Schedule, section: Section): void {
        if (section.method === "ASYNC") {
            if (!schedule.times.ASYNC) { schedule.times.ASYNC = {}; }
            if (!schedule.times.ASYNC["0"]) { schedule.times.ASYNC["0"] = []; }
            schedule.times.ASYNC["0"].push(section.id);
        } else {
            for (const newSess of section.sessions) {

                if (!schedule.times[newSess.day]) { schedule.times[newSess.day] = {}; }
                const day = schedule.times[newSess.day];

                for (let i = newSess.start; i < newSess.end; i++) {
                    day[i] = [section.id];
                }
            }
        }
    }

    /**
     * Remove a section without object cleaning
     */
    private popSection(schedule: Schedule, newSect: Section): void {
        if (newSect.method === "ASYNC") {
            schedule.times.ASYNC["0"].pop();
        } else {
            for (const newSess of newSect.sessions) {

                const day = schedule.times[newSess.day];
                for (let i = newSess.start; i < newSess.end; i++) {
                    day[i].pop();
                }
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
                    if (dayTimes[timeString] && dayTimes[timeString].length > 0) {
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
        return JSON.parse(JSON.stringify(schedule));
    }

    private populate(
        schedule: Schedule,
        settings = { allowFull: true, scheduleCount: 10 },
        groups: Array<Section[]>,
        output: Schedule[],
        groupInd: number = 0,
        threads: number = 1,
        threadInd: number = 0,
        first: boolean = false,
    ) {
        if (groupInd >= groups.length) {
            this.scoreSchedule(schedule);

            for (let i = 0; i < output.length; i++) {
                if (output[i].score < schedule.score) {
                    output.splice(i, 0, this.copySchedule(schedule));
                    if (output.length > settings.scheduleCount) { output.pop(); }
                    return;
                }
            }

            if (output.length < settings.scheduleCount) { output.push(this.copySchedule(schedule)); }
            return;
        }

        if (groupInd >= groups.length) { return; }

        for (const lec of groups[groupInd]) {
            console.log("CONFLICT", this.isConflicting(schedule, lec));
            if (this.isConflicting(schedule, lec)) { continue; }
            // await sleep(0);
            this.pushSection(schedule, lec);
            this.populate(schedule, settings, groups, output, groupInd + 1, threads, threadInd, first);
            this.popSection(schedule, lec);
        }
    }

    cleanSchedule(scheduleData: ScheduleData) {
        for (const day of Object.keys(scheduleData.schedule.times)) {
            for (const time of Object.keys(scheduleData.schedule.times[day])) {
                const sections = scheduleData.schedule.times[day][time];

                for (let ind = sections.length - 1; ind > -1; ind--) {
                    const sectID = sections[ind];
                    if (!sectID) { continue; }

                    const section = scheduleData.sections[sectID];
                    const course = scheduleData.schedule.courses.find(a => {
                        return a.courseID === section.courseID;
                    });
                    if (!course) { continue; }
                    if (section.code.startsWith("LEC")) {
                        if (course.autoLecture) {
                            sections.splice(ind, 1);
                            delete scheduleData.conflicts[section.code];
                        }
                    } else if (section.code.startsWith("PRA")) {
                        if (course.autoPratical) {
                            sections.splice(ind, 1);
                        }
                    } else if (section.code.startsWith("TUT")) {
                        if (course.autoTutorial) {
                            sections.splice(ind, 1);
                        }
                    }
                }
            }
        }
    }

    createSchedule(scheduleData: ScheduleData): Schedule[] {
        const start = Date.now();
        this.cleanSchedule(scheduleData);
        const settings = { allowFull: true, scheduleCount: 10 };
        const output: Schedule[] = [];
        const groups: Array<Section[]> = [];
        for (const course of scheduleData.schedule.courses) {
            if (course.autoLecture) {
                const temp = [];
                for (const sect of scheduleData.courseSections[course.courseID].lectures) {
                    const sectData = scheduleData.sections[sect];
                    if (!settings.allowFull && sectData.curEnroll >= sectData.maxEnroll) { continue; }
                    temp.push(sectData);
                }
                if (temp.length > 0) { groups.push(temp); }
            }
        }
        for (const course of scheduleData.schedule.courses) {
            if (course.autoLecture) {
                const temp = [];
                for (const sect of scheduleData.courseSections[course.courseID].tutorials) {
                    const sectData = scheduleData.sections[sect];
                    if (!settings.allowFull && sectData.curEnroll >= sectData.maxEnroll) { continue; }
                    temp.push(sectData);
                }
                if (temp.length > 0) { groups.push(temp); }
            }
        }
        for (const course of scheduleData.schedule.courses) {
            if (course.autoLecture) {
                const temp = [];
                for (const sect of scheduleData.courseSections[course.courseID].praticals) {
                    const sectData = scheduleData.sections[sect];
                    if (!settings.allowFull && sectData.curEnroll >= sectData.maxEnroll) { continue; }
                    temp.push(sectData);
                }
                if (temp.length > 0) { groups.push(temp); }
            }
        }
        // this.scheduleCount = 0;

        console.log("SCHEDULE", scheduleData.schedule, settings, groups, output);

        this.populate(scheduleData.schedule, settings, groups, output);

        if (output.length === 0) {
            console.log("No Possible Schedules!");
        } else {
            console.log("New schedules:", output);
            console.log(`Found ? possible schdules in ${(Date.now() - start) / 1000}s!`);
        }

        return output;
    }
}
