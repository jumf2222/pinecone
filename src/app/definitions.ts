export interface Course {
    name: string;
    code: string;
    distReq: string;
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
    start: number;
    end: number;
    room: string;
}

export interface Schedule {
    sections: Array<Section>;
    times: Map<string, Array<boolean>>;
    score: number;
}

export interface SchedulerDataSource {
    Id: Number,
    Subject: string,
    StartTime: Date,
    EndTime: Date,
    FREQ: string
}
export const ACADEMIC_SESSIONS = { PREV: "1", SPRING: "5", FALL_WINTER: "9" };