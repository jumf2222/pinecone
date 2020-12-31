import { derived, writable } from "svelte/store";
import type { Course } from "./types";

let data = localStorage.getItem("courses");
let profs = data ? JSON.parse(data) : [];

data = localStorage.getItem("currentCourse");
let curProf = data ? JSON.parse(data) : 0;

export const courses = writable<Course[]>(profs);
export const currentCourse = writable<number>(curProf);

courses.subscribe(data => { localStorage.setItem("courses", JSON.stringify(data)); });
currentCourse.subscribe(data => { localStorage.setItem("currentCourse", JSON.stringify(data)); });
