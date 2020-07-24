export interface Course {
    id: string;
    name: string;
    code: string;
    year: string;
    term: string;
    campus: string;
    distribution: string;
    description: string;
    prerequisites: string;
    corequisites: string;
    exclusions: string;
    breadth: string;
}

export interface Section {
    id: string;
    courseID: string;
    sessions: Session[];
    code: string;
    instructors: string[];
    curEnroll: number;
    maxEnroll: number;
    method: string;
}

export interface Session {
    day: string;
    start: number;
    end: number;
    location: string;
}

// export interface DaySlot {
//     name: string,
//     times: Object,
// }

// export interface TimeSlot {
//     time: number,
//     section: Section,
// }

export interface Schedule {
    id: string;
    year: string;
    term: string;
    name: string;
    courses: CourseOption[];
    score: number;
    times: Dictionary<Dictionary<(string | null)[]>>;
}

export interface ScheduleData {
    schedule: Schedule;
    courses: Dictionary<Course>;
    sections: Dictionary<Section>;
    conflicts: Dictionary<boolean>;
    courseSections: Dictionary<CourseSection>;
}

export interface CourseSection {
    lectures: string[];
    praticals: string[];
    tutorials: string[];
}

export interface CourseOption {
    courseID: string;
    autoLecture: boolean;
    autoPratical: boolean;
    autoTutorial: boolean;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

// export interface SchedulerDataSource {
//     Id: Number,
//     Subject: string,
//     StartTime: Date,
//     EndTime: Date,
//     FREQ: string
// }
// export const ACADEMIC_SESSIONS = { PREV: "1", SPRING: "5", FALL_WINTER: "9" };
export const DAY_CODES = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
export const CAMPUS_NAMES: Dictionary<string> = { 5: "UTM", 1: "UTSG", 3: "UTSC" };

// export const TERMS = ["F", "S", "SF", "SS"];

// export interface Program {
//     name: string;
//     code: string;
// }

// export interface Degree {
//     programs: Program[];
//     years: DegreeYear[];
// }

// export interface DegreeYear {
//     level: number;
//     credits: number;
//     activeTerm: number;
//     schedules: Dictionary<Schedule>;
// }

// export interface SearchResult {
//     query: string;
//     data: Course[];
//     startKey: { code: string, term: string };
// }


