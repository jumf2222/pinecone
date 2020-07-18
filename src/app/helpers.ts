import { Course } from './definitions';

export function binSearch(query: string, courses: Course[]): Course {
    let start = 0;
    let end = courses.length - 1;

    while (start < end) {
        let mid = Math.floor((start + end) / 2);
        if (courses[mid].code < query)
            start = mid + 1;
        else
            end = mid - 1;
    }

    if (courses[start].code === query) {
        return courses[start];
    }

    return null;
}

export function binSearchLeft(query: string, courses: Course[]): number {
    let start = 0;
    let end = courses.length;

    while (start < end) {
        let mid = Math.floor((start + end) / 2);
        if (courses[mid].code < query)
            start = mid + 1;
        else
            end = mid;
    }

    return start;
}

export function binSearchRight(query: string, courses: Course[]): number {
    let start = 0;
    let end = courses.length;


    while (start < end) {
        let mid = Math.floor((start + end) / 2);
        if (courses[mid].code.substring(0, query.length) > query)
            end = mid;
        else
            start = mid + 1;
    }

    return end;
}
