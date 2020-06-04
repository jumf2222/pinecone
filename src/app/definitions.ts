export interface Course {
    name: string;
    description: string;
    prerequisites: string;
    exclusions: string;
    fillPercent: number;
    enrollControlsType: string;
    enrollControls: Array<string>;
    lecs: Array<Section>;
    tuts: Array<Section>;
    pras: Array<Section>;
}

export interface Section {
    sessions: Array<Session>;
    syllabus: string;
    section: string;
    instructor: string;
    curEnroll: number;
    maxEnroll: number;
    waitlistEnroll: number;
    notes: string;

}

export interface Session {
    day: string;
    start: string;
    end: string;
    room: string;
}

export const ACADEMIC_SESSIONS = { PREV: "1", SPRING: "5", FALL_WINTER: "9" };